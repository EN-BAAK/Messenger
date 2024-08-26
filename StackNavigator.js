import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import HomeScreen from "./screens/HomeScreen";
import FriendsScreen from "./screens/FriendsScreen";
import ChatScreen from "./screens/ChatsScreen";
import ChatMessageScreen from "./screens/ChatMessageSceen";

const Stack = createNativeStackNavigator();

const StackNavigator = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen
                    name="Login"
                    component={LoginScreen}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="Register"
                    component={RegisterScreen}
                    options={{ headerShown: false }}
                />
                <Stack.Screen name="Home" component={HomeScreen} />

                <Stack.Screen name="Friends" component={FriendsScreen} />

                <Stack.Screen name="Chats" component={ChatScreen} />

                <Stack.Screen name="Messages" component={ChatMessageScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default StackNavigator;
