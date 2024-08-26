import { Pressable, Text, View, Image } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import colors from "../misc/colors";
import { UserType } from "../context/UseContext";
import { MAIN_API_APP } from "../misc/constants";

const User = ({ item }) => {
    const [requestSent, setRequestSent] = useState(false);
    const [friendsSent, setFriendsSent] = useState(false);
    const [friendRequests, sentFriendRequests] = useState([]);
    const [userFriends, setUserFriends] = useState([]);

    const { userId, setUserId } = useContext(UserType);

    const sendFriendRequest = async (currentUserId, selectedUserId) => {
        try {
            const response = await fetch(`${MAIN_API_APP}/friend-request`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ currentUserId, selectedUserId }),
            });

            if (response.ok) {
                setRequestSent(true);
            }
        } catch (err) {
            console.log("Error", err);
        }
    };

    useEffect(() => {
        const fetchFriendRequests = async () => {
            try {
                const response = await fetch(
                    `${MAIN_API_APP}/friend-requests/send/${userId}`
                );
                const data = await response.json();

                if (response.ok) {
                    sentFriendRequests(data);
                }
            } catch (err) {
                console.log(err);
            }
        };

        fetchFriendRequests();
    }, []);

    useEffect(() => {
        const fetchUserFriends = async () => {
            try {
                const response = await fetch(
                    `${MAIN_API_APP}/friends/${userId}`
                );

                const data = await response.json();

                if (response.ok) {
                    setUserFriends(data);
                }
            } catch (err) {
                console.log("Error", err);
            }
        };

        fetchUserFriends();
    }, []);

    return (
        <Pressable
            style={{
                flexDirection: "row",
                alignItems: "center",
                marginVertical: 10,
            }}
        >
            <View>
                <Image
                    style={{
                        width: 50,
                        height: 50,
                        borderRadius: 25,
                        resizeMode: "cover",
                    }}
                    source={{ uri: item.image }}
                />
            </View>

            <View style={{ marginLeft: 12, flex: 1 }}>
                <Text style={{ fontWeight: "bold" }}>{item?.name}</Text>
                <Text style={{ marginTop: 4, color: colors.gray }}>
                    {item?.email}
                </Text>
            </View>

            {userFriends.includes(item._id) ? (
                <Pressable
                    style={{
                        backgroundColor: colors.green,
                        padding: 10,
                        borderRadius: 6,
                        width: 105,
                    }}
                >
                    <Text
                        style={{
                            textAlign: "center",
                            color: colors.white,
                            fontSize: 13,
                        }}
                    >
                        Friends
                    </Text>
                </Pressable>
            ) : requestSent ||
              friendRequests.some((friend) => friend._id === item._id) ? (
                <Pressable
                    style={{
                        backgroundColor: colors.gray,
                        padding: 10,
                        borderRadius: 6,
                        width: 105,
                    }}
                >
                    <Text
                        style={{
                            textAlign: "center",
                            color: colors.white,
                            fontSize: 13,
                        }}
                    >
                        Request Sent
                    </Text>
                </Pressable>
            ) : (
                <Pressable
                    onPress={() => sendFriendRequest(userId, item._id)}
                    style={{
                        backgroundColor: colors.mainBlue,
                        padding: 10,
                        borderRadius: 6,
                        width: 105,
                    }}
                >
                    <Text
                        style={{
                            textAlign: "center",
                            color: colors.white,
                            fontSize: 13,
                        }}
                    >
                        Add Friend
                    </Text>
                </Pressable>
            )}
        </Pressable>
    );
};

export default User;
