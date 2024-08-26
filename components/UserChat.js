import { Pressable, Image, View, Text } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import colors from "../misc/colors";
import { useNavigation } from "@react-navigation/native";
import { MAIN_API_APP } from "../misc/constants";
import { UserType } from "../context/UseContext";

const UserChat = ({ item }) => {
    const [messages, setMessages] = useState([]);

    const navigation = useNavigation();
    const { userId, setUserId } = useContext(UserType);

    const getLastMessage = () => {
        const userMessages = messages.filter(
            (message) => message.messageType === "text"
        );

        const n = userMessages.length - 1;

        return userMessages[n] || "Empty";
    };

    const formatTime = (time) => {
        const options = { hour: "numeric", minute: "numeric" };
        return new Date(time).toLocaleString("en-US", options);
    };

    const fetchMessages = async () => {
        try {
            const response = await fetch(
                `${MAIN_API_APP}/messages/${userId}/${item._id}`
            );
            const data = await response.json();

            if (response.ok) {
                setMessages(data);
            }
        } catch (ere) {
            console.log("Error Fetching Messages", err);
        }
    };

    useEffect(() => {
        fetchMessages();
    }, []);

    const lastMessage = getLastMessage(messages);

    return (
        <Pressable
            onPress={() =>
                navigation.navigate("Messages", {
                    recipientId: item?._id,
                })
            }
            style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 10,
                borderWidth: 0.7,
                borderColor: "#d0d0d0",
                borderTopWidth: 0,
                borderLeftWidth: 0,
                borderRightWidth: 0,
                padding: 10,
            }}
        >
            <Image
                style={{
                    width: 50,
                    height: 50,
                    borderRadius: 25,
                    resizeMode: "cover",
                }}
                source={{ uri: item?.image }}
            />

            <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 15, fontWeight: "500" }}>
                    {item?.name}
                </Text>
                <Text
                    style={{
                        marginTop: 3,
                        color: colors.gray,
                        fontWeight: "500",
                    }}
                >
                    {lastMessage?.message}
                </Text>
            </View>

            <View>
                <Text
                    style={{
                        fontSize: 11,
                        fontWeight: "400",
                        color: colors.lightGray,
                    }}
                >
                    {formatTime(lastMessage?.timeStamp)}
                </Text>
            </View>
        </Pressable>
    );
};

export default UserChat;
