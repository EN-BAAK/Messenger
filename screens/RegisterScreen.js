import {
    Alert,
    KeyboardAvoidingView,
    Pressable,
    Text,
    TextInput,
    View,
} from "react-native";
import React, { useState } from "react";
import colors from "../misc/colors";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import { MAIN_API_APP } from "../misc/constants";

const RegisterScreen = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [image, setImage] = useState("");

    const navigation = useNavigation();

    const handleRegister = () => {
        const user = {
            name,
            email,
            password,
            image,
        };

        axios
            .post(`${MAIN_API_APP}/register`, user)
            .then(() => {
                Alert.alert(
                    `Registration Successful`,
                    `You Have Been Registered Successfully `
                );

                setName("");
                setEmail("");
                setPassword("");
                setImage("");
            })
            .catch((err) => {
                Alert.alert(`Registration Error`, "Maybe The Email Is Invalid");
                console.log("registration failed", err);
            });
    };

    return (
        <View
            style={{
                flex: 1,
                backgroundColor: colors.white,
                padding: 10,
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            <KeyboardAvoidingView>
                <View
                    style={{
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    <Text
                        style={{
                            color: colors.mainBlue,
                            fontSize: 24,
                            fontWeight: "600",
                        }}
                    >
                        Register
                    </Text>
                    <Text
                        style={{
                            color: colors.black,
                            fontSize: 17,
                            fontWeight: "600",
                            marginTop: 15,
                        }}
                    >
                        Register To Your Account
                    </Text>
                </View>

                <View style={{ marginTop: 50 }}>
                    <View>
                        <Text
                            style={{
                                fontSize: 18,
                                fontWeight: "600",
                                color: colors.gray,
                            }}
                        >
                            Name
                        </Text>
                        <TextInput
                            style={{
                                borderBottomColor: colors.gray,
                                borderBottomWidth: 1,
                                marginVertical: 10,
                                width: 300,
                                fontSize: 18,
                            }}
                            value={name}
                            onChangeText={(text) => setName(text)}
                            placeholder="Enter Your Name"
                            placeholderTextColor={"black"}
                        />
                    </View>

                    <View style={{ marginTop: 10 }}>
                        <Text
                            style={{
                                fontSize: 18,
                                fontWeight: "600",
                                color: colors.gray,
                            }}
                        >
                            Email
                        </Text>
                        <TextInput
                            style={{
                                borderBottomColor: colors.gray,
                                borderBottomWidth: 1,
                                marginVertical: 10,
                                width: 300,
                                fontSize: 18,
                            }}
                            value={email}
                            onChangeText={(text) => setEmail(text)}
                            placeholder="Enter Your Email"
                            placeholderTextColor={"black"}
                        />
                    </View>

                    <View style={{ marginTop: 10 }}>
                        <Text
                            style={{
                                fontSize: 18,
                                fontWeight: "600",
                                color: colors.gray,
                            }}
                        >
                            Password
                        </Text>
                        <TextInput
                            style={{
                                borderBottomColor: colors.gray,
                                borderBottomWidth: 1,
                                marginVertical: 10,
                                width: 300,
                                fontSize: 18,
                            }}
                            value={password}
                            onChangeText={(text) => setPassword(text)}
                            secureTextEntry={true}
                            placeholder="Enter Your Password"
                            placeholderTextColor={"black"}
                        />
                    </View>

                    <View style={{ marginTop: 10 }}>
                        <Text
                            style={{
                                fontSize: 18,
                                fontWeight: "600",
                                color: colors.gray,
                            }}
                        >
                            Image
                        </Text>
                        <TextInput
                            style={{
                                borderBottomColor: colors.gray,
                                borderBottomWidth: 1,
                                marginVertical: 10,
                                width: 300,
                                fontSize: 18,
                            }}
                            value={image}
                            onChangeText={(text) => setImage(text)}
                            placeholder="Image"
                            placeholderTextColor={"black"}
                        />
                    </View>

                    <Pressable
                        style={{
                            width: 200,
                            backgroundColor: colors.mainBlue,
                            padding: 15,
                            marginTop: 50,
                            marginLeft: "auto",
                            marginRight: "auto",
                            borderRadius: 6,
                        }}
                        onPress={handleRegister}
                    >
                        <Text
                            style={{
                                color: colors.white,
                                fontSize: 16,
                                fontWeight: "bold",
                                textAlign: "center",
                            }}
                        >
                            Register
                        </Text>
                    </Pressable>

                    <Pressable style={{ marginTop: 15 }}>
                        <Text
                            style={{
                                textAlign: "center",
                                color: colors.gray,
                                fontSize: 16,
                            }}
                            onPress={() => navigation.navigate("Login")}
                        >
                            Already Have An Account? Sign In
                        </Text>
                    </Pressable>
                </View>
            </KeyboardAvoidingView>
        </View>
    );
};

export default RegisterScreen;
