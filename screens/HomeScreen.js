import React, { useContext, useLayoutEffect, useEffect, useState } from "react";
import { View, Text } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import colors from "../misc/colors";
import { UserType } from "../context/UseContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { MAIN_API_APP } from "../misc/constants";
import { decode, encode } from "base-64";
import User from "../components/User";

if (!global.btoa) {
    global.btoa = encode;
}

if (!global.atob) {
    global.atob = decode;
}

const HomeScreen = () => {
    const { userId, setUserId } = useContext(UserType);
    const [users, setUsers] = useState([]);

    const navigation = useNavigation();

    useLayoutEffect(() => {
        navigation.setOptions({
            headerTitle: "",
            headerLeft: () => (
                <Text style={{ fontSize: 16, fontWeight: "bold" }}>
                    Swift Chat
                </Text>
            ),
            headerRight: () => (
                <View
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 8,
                    }}
                >
                    <Ionicons
                        onPress={() => navigation.navigate("Chats")}
                        name="chatbox-ellipses-outline"
                        size={24}
                        color={colors.black}
                    />
                    <MaterialIcons
                        onPress={() => navigation.navigate("Friends")}
                        name="people-outline"
                        size={24}
                        color={colors.black}
                    />
                </View>
            ),
        });
    }, []);

    useEffect(() => {
        const fetchUsers = async () => {
            const token = await AsyncStorage.getItem("authToken");
            const decodeToken = jwtDecode(token);
            const userId = decodeToken.userId;
            setUserId(userId);

            axios
                .get(`${MAIN_API_APP}/users/${userId}`)
                .then((response) => {
                    setUsers(response.data);
                })
                .catch((err) => {
                    console.log("Error Retrieving Users", err);
                });
        };

        fetchUsers();
    }, []);

    if (!users.length) {
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
                    There Is No Users Yet
                </Text>
            </View>
        );
    }

    return (
        <View>
            <View style={{ padding: 10 }}>
                {users.map((item, index) => (
                    <User key={index} item={item} />
                ))}
            </View>
        </View>
    );
};

export default HomeScreen;
