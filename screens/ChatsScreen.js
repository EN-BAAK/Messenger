import { View, Text, ScrollView, Pressable } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { UserType } from "../context/UseContext";
import { useNavigation } from "@react-navigation/native";
import { MAIN_API_APP } from "../misc/constants";
import UserChat from "../components/UserChat";

const ChatScreen = () => {
    const [acceptedFriends, setAcceptedFriends] = useState([]);

    const { userId, setUserId } = useContext(UserType);
    const navigation = useNavigation();

    useEffect(() => {
        const acceptedFriendsList = async () => {
            try {
                const response = await fetch(
                    `${MAIN_API_APP}/accepted-friends/${userId}`
                );
                const data = await response.json();

                if (response.ok) {
                    setAcceptedFriends(data);
                }
            } catch (err) {
                console.log("Error Showing The Accepted Friends");
            }
        };

        acceptedFriendsList();
    });

    return (
        <ScrollView showsVerticalScrollIndicator={false}>
            <Pressable>
                {acceptedFriends.map((item, index) => (
                    <UserChat key={index} item={item} />
                ))}
            </Pressable>
        </ScrollView>
    );
};

export default ChatScreen;
