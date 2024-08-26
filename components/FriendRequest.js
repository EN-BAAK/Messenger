import { View, Text, Image, Pressable } from "react-native";
import React, { useContext } from "react";
import colors from "../misc/colors";
import { MAIN_API_APP } from "../misc/constants";
import { UserType } from "../context/UseContext";
import { useNavigation } from "@react-navigation/native";

const FriendRequest = ({item, friendRequests, setFriendRequests}) => {
    const { userId, setUserId } = useContext(UserType);
    const navigation = useNavigation();

    const acceptRequest = async (friendRequestId) => {
        try {
            const response = await fetch(
                `${MAIN_API_APP}/friend-request/accept`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        senderId: friendRequestId,
                        recipientId: userId,
                    }),
                }
            );

            if (response.ok) {
                setFriendRequests(
                    friendRequests.filter(
                        (request) => request._id !== friendRequestId
                    )
                );

                navigation.navigate("Chats");
            }
        } catch (err) {
            console.log("Error Accepting The Friend Request", err);
        }
    };

    return (
        <Pressable
            style={{
                marginVertical: 10,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
            }}
        >
            <Image
                source={{ uri: item.image }}
                style={{ width: 50, height: 50, borderRadius: 25 }}
            />

            <Text
                style={{
                    fontSize: 15,
                    fontWeight: "bold",
                    marginLeft: 10,
                    flex: 1,
                    color: colors.black,
                }}
            >
                {item?.name} send you a request
            </Text>

            <Pressable
                onPress={() => acceptRequest(item._id)}
                style={{
                    backgroundColor: colors.mainBlue,
                    padding: 10,
                    borderRadius: 6,
                }}
            >
                <Text style={{ textAlign: "center", color: colors.white }}>
                    Accept
                </Text>
            </Pressable>
        </Pressable>
    );
};

export default FriendRequest;
