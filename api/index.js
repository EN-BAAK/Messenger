require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const LocalStrategy = require("passport-local").Strategy;
const cors = require("cors");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const User = require("./models/user");
const Message = require("./models/message");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const multer = require("multer");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "files/");
    },
    filename: function (req, file, cb) {
        const uniquesSuffix =
            Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, uniquesSuffix + "-" + file.originalname);
    },
});

const upload = multer({ storage: storage });
const app = express();
const port = 8000;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(passport.initialize());

mongoose
    .connect(`${process.env.MONGO_DB_KEY}`)
    .then(() => console.log(`Connected To MongoDB`))
    .catch((err) => {
        console.log("Error Connecting To MongoDB", err);
    });

// endpoint for registration of the user
app.post(
    "/register",
    [
        body("name")
            .notEmpty()
            .withMessage("The Name Is Required")
            .isString()
            .withMessage("Name Should Be String"),
        body("email").notEmpty().withMessage("The Email Is Required").isEmail(),
        body("password")
            .notEmpty()
            .withMessage("The Password Is Required")
            .isLength({ min: 6 })
            .withMessage("password Should Be At Less 6 Character"),
        body("image").notEmpty().withMessage("The Image Should Not Be Empty"),
    ],
    async (req, res) => {
        try {
            const { body: data } = req;
            const result = validationResult(req);

            if (!result.isEmpty()) {
                return res.status(400).send("Invalid Data");
            }

            const user = await User.findOne({ email: data.email });

            if (user) {
                return res
                    .status(400)
                    .json({ message: "The User Already Exist" });
            }

            data.password = hashPassword(data.password);

            const newUser = new User({ ...data });

            newUser.save();

            res.status(200).json({ message: "User Registered Successfully" });
        } catch (err) {
            console.log(`Error Registering User`, err);
            res.status(500).json({
                message: "Error Registering The User!",
            });
        }
    }
);

// endpoint for logging in of the user
app.post(
    "/login",
    [
        body("email").notEmpty().withMessage("Email Should Not Be Empty"),
        body("password").notEmpty().withMessage("Password Should Not Be Empty"),
    ],
    async (req, res) => {
        try {
            const { body: data } = req;
            const result = validationResult(req);

            if (!result.isEmpty()) {
                return res.status(400).json({ message: "Invalid Data" });
            }

            const user = await User.findOne({ email: data.email });

            if (!user)
                return res.status(404).json({ message: "User Not Found" });

            const isMatch = await bcrypt.compare(data.password, user.password);

            if (!isMatch)
                return res.status(401).json({ message: "Invalid Credentials" });

            const token = createToken(user._id);

            res.status(200).json({ token });
        } catch (err) {
            console.log("Error Login", err);
            res.status(500).json({ message: "Login Failed" });
        }
    }
);

// endpoint to access all the users except the use who's is currently logged in

app.get("/users/:userId", (req, res) => {
    const loggedInUserId = req.params.userId;

    User.find({ _id: { $ne: loggedInUserId } }) //+ new => Not Equal
        .then((users) => {
            res.status(200).json(users);
        })
        .catch((err) => {
            console.log("Error Find Users");
            res.status(500).json({ message: "Fetch The Users Failed" });
        });
});

// end point to send a request to a user
app.post("/friend-request", async (req, res) => {
    const { currentUserId, selectedUserId } = req.body;

    try {
        //! Update The Recipients's FriendRequestsArray
        await User.findByIdAndUpdate(selectedUserId, {
            $push: { friendRequests: currentUserId },
        });

        //! Update The Sender's SentFriendRequests Array
        await User.findByIdAndUpdate(currentUserId, {
            $push: { sentFriendRequest: selectedUserId },
        });

        res.sendStatus(200);
    } catch (err) {
        console.log("Error Request Friend", err);
        res.sendStatus(500);
    }
});

// endpoint to show all the friend-requests of a particular user
app.get("/friend-request/:userId", async (req, res) => {
    try {
        const { userId } = req.params;

        // fetch the user document based on the user id
        const user = await User.findById(userId)
            .populate("friendRequests", "name email image")
            .lean();

        const friendRequests = user.friendRequests;

        res.json(friendRequests);
    } catch (err) {
        console.log("Error In Fetch Friend Requests", err);
        res.status(500).send({ message: "Internal Server Error" });
    }
});

// endpoint to accept a friend-request of a particular person
app.post("/friend-request/accept", async (req, res) => {
    try {
        const { senderId, recipientId } = req.body;

        const sender = await User.findById(senderId);
        const recipient = await User.findById(recipientId);

        console.log(senderId, recipientId);

        sender.friends.push(recipientId);
        recipient.friends.push(senderId);

        recipient.friendRequests = recipient.friendRequests.filter(
            (request) => request.toString() !== senderId
        );

        sender.sentFriendRequest = recipient.sentFriendRequest.filter(
            (request) => request.toString() !== recipientId
        );

        await sender.save();
        await recipient.save();

        res.status(200).json({
            message: "Friend Request Accepted Successfully",
        });
    } catch (err) {
        console.log("Error In Accept Friend Request", err);
        res.status(500).json({ message: "Accept Friend Request Failed" });
    }
});

// endpoint to access all the friends of the logged in user
app.get("/accepted-friends/:userId", async (req, res) => {
    try {
        const { userId } = req.params;
        const user = await User.findById(userId).populate(
            "friends",
            "name email image"
        );

        const acceptedFriends = user.friends;

        res.json(acceptedFriends);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

//endpoint to post messages and store it in hte backend
app.post("/messages", upload.single("imageFile"), async (req, res) => {
    try {
        const { senderId, recipientId, messageType, messageText } = req.body;

        const newMessage = new Message({
            senderId,
            recipientId,
            messageType,
            message: messageText,
            timeStamp: new Date(),
            imageUrl: messageType === "image" ? req.file.path : null,
        });

        await newMessage.save();

        res.status(200).json({ message: "Message Send Successfully" });
    } catch (err) {
        console.log(err);
        res.status(500), json({ error: "Internal Server Error" });
    }
});

//endpoint to get the userDetails to design the chat room header
app.get("/user/:userId", async (req, res) => {
    try {
        const { userId } = req.params;

        const recipientId = await User.findById(userId);

        res.json(recipientId);
    } catch (err) {
        console.log(err);
        res.status(500), json({ error: "Internal Server Error" });
    }
});

//endpoint to fetch the message between two users in the chatRoom
app.get("/messages/:senderId/:recipientId", async (req, res) => {
    try {
        const { senderId, recipientId } = req.params;

        const message = await Message.find({
            $or: [
                { senderId: senderId, recipientId: recipientId },
                { senderId: recipientId, recipientId: senderId },
            ],
        }).populate("senderId", "_id name");

        res.json(message);
    } catch (err) {
        console.log(err);
        res.status(500), json({ error: "Internal Server Error" });
    }
});

app.get("/friend-requests/send/:userId", async (req, res) => {
    try {
        const { userId } = req.params;
        const user = await User.findById(userId).populate(
            "sentFriendRequest",
            "name email image"
        );

        const sentFriendRequest = user.sentFriendRequest;

        res.json(sentFriendRequest);
    } catch (err) {
        console.log(err);
        res.status(500), json({ error: "Internal Server Error" });
    }
});

app.get("/friends/:userId", (req, res) => {
    try {
        const { userId } = req.params;

        User.findById(userId)
            .populate("friends")
            .then((user) => {
                if (!user) {
                    return res.status(404).json({ message: "User not found" });
                }

                const friendIds = user.friends.map((friend) => friend._id);

                res.status(200).json(friendIds);
            });
    } catch (err) {
        console.log(err);
        res.status(500), json({ error: "Internal Server Error" });
    }
});

app.listen(port, () => {
    console.log("Server Is Running On Port 8000");
});

function createToken(userId) {
    const payload = {
        userId,
    };

    const token = jwt.sign(payload, `${process.env.JWT_SECRET_KEY}`, {
        expiresIn: "1h",
    });

    return token;
}

function hashPassword(password) {
    const salt = bcrypt.genSaltSync(10);

    return bcrypt.hashSync(password, salt);
}
