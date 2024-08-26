const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    friendRequests: [
        //+ The Friends Whose Send Request To You
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
    ],
    friends: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
    ],
    sentFriendRequest: [
        {
            type: mongoose.Schema.Types.ObjectId,
        },
    ],
});

const User = mongoose.model("User", userSchema);

module.exports = User;
