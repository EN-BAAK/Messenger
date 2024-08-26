import { View, Text } from "react-native";
import React, { useEffect, useContext, useState } from "react";
import { MAIN_API_APP } from "../misc/constants";
import { UserType } from "../context/UseContext";
import axios from "axios";
import colors from "../misc/colors";
import FriendRequest from "../components/FriendRequest";

const FriendsScreen = () => {
    const { userId, setUserId } = useContext(UserType);
    const [friendRequests, setFriendRequests] = useState([]);

    const fetchFriendRequests = async () => {
        try {
            const response = await axios.get(
                `${MAIN_API_APP}/friend-request/${userId}`
            );

            if (response.status === 200) {
                const friendRequestsData = response.data.map(
                    (friendRequest) => ({
                        _id: friendRequest._id,
                        name: friendRequest.name,
                        email: friendRequest.email,
                        image: friendRequest.image,
                    })
                );

                setFriendRequests(friendRequestsData);
            }
        } catch (err) {
            console.log("Error", err);
        }
    };

    useEffect(() => {
        fetchFriendRequests();
    }, []);

    if (!friendRequests.length) {
        return (
            <View
                style={{
                    backgroundColor: colors.mainBlue,
                    marginVertical: 15,
                    marginRight: "auto",
                    marginLeft: "auto",
                    paddingHorizontal: 15,
                    paddingVertical: 5,
                    borderRadius: 25,
                }}
            >
                <Text
                    style={{
                        textAlign: "center",
                        fontSize: 24,
                        color: colors.white,
                    }}
                >
                    There Is No Friend Request
                </Text>
            </View>
        );
    }

    console.log(friendRequests)

    return (
        <View style={{ padding: 10, marginHorizontal: 12 }}>
            <Text>Your Friend Requests!</Text>
            {friendRequests.map((item, index) => (
                <FriendRequest
                    key={index}
                    item={item}
                    friendRequests={friendRequests}
                    setFriendRequests={setFriendRequests}
                />
            ))}
        </View>
    );
};

export default FriendsScreen;
