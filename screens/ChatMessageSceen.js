import {
    ScrollView,
    Text,
    View,
    KeyboardAvoidingView,
    TextInput,
    Pressable,
    Image,
} from "react-native";
import React, {
    useContext,
    useEffect,
    useLayoutEffect,
    useRef,
    useState,
} from "react";
import colors from "../misc/colors";
import { Entypo, Feather } from "@expo/vector-icons";
import EmojiSelector from "react-native-emoji-selector";
import { UserType } from "../context/UseContext";
import { MAIN_API_APP } from "../misc/constants";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useRoute } from "@react-navigation/native";

const ChatMessageScreen = () => {
    const [showEmojiSelector, setShowEmojiSelector] = useState(false);
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const [selectedImage, setSelectedImage] = useState("");
    const [recipientData, setRecipientData] = useState();

    const navigation = useNavigation();
    const route = useRoute();
    const { userId, setUserId } = useContext(UserType);

    const { recipientId } = route.params;

    const handleEmojiSelector = () => {
        setShowEmojiSelector(!showEmojiSelector);
    };

    const handleSend = async (messageType, imageUri) => {
        if (message === "") return;
        try {
            const formData = new FormData();
            formData.append("senderId", userId);
            formData.append("recipientId", recipientId);

            if (messageType === "image") {
                formData.append("messageType", "image");
                formData.append("imageFile", {
                    uri: imageUri,
                    name: "image.jpg",
                    type: "image/jpeg",
                });
            } else {
                formData.append("messageType", "text");
                formData.append("messageText", message);
            }

            const response = await fetch(`${MAIN_API_APP}/messages`, {
                method: "POST",
                body: formData,
            });

            if (response.ok) {
                setMessage("");
                setSelectedImage("");

                fetchMessages();
            }
        } catch (err) {
            console.log("Error In Sending The Message", err);
        }
    };

    const fetchMessages = async () => {
        try {
            const response = await fetch(
                `${MAIN_API_APP}/messages/${userId}/${recipientId}`
            );
            const data = await response.json();

            if (response.ok) {
                setMessages(data);
            } else {
                console.log("Error Showing Messages", response.status.message);
            }
        } catch (err) {
            console.log("Error Fetching Messages", err);
        }
    };

    const formatTime = (time) => {
        const options = { hour: "numeric", minute: "numeric" };
        return new Date(time).toLocaleString("en-US", options);
    };

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            handleSend("image", result.uri);
        }
    };

    const scrollViewRef = useRef(null);

    const handleContentSizeChange = () => {
        scrollToBottom();
    };

    const scrollToBottom = () => {
        if (scrollViewRef.current) {
            scrollViewRef.current.scrollToEnd({ animated: false });
        }
    };

    useLayoutEffect(() => {
        navigation.setOptions({
            headerTitle: "",
            headerLeft: () => (
                <View
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 10,
                    }}
                >
                    <Ionicons
                        name="arrow-back"
                        size={24}
                        color={colors.black}
                        onPress={() => navigation.goBack()}
                    />

                    <View
                        style={{ flexDirection: "row", alignItems: "center" }}
                    >
                        <Image
                            style={{
                                width: 30,
                                height: 30,
                                borderRadius: 15,
                                resizeMode: "cover",
                            }}
                            source={{ uri: recipientData?.image }}
                        />

                        <Text
                            style={{
                                marginLeft: 5,
                                fontSize: 15,
                                fontWeight: "bold",
                            }}
                        >
                            {recipientData?.name}
                        </Text>
                    </View>
                </View>
            ),
        });
    }, [recipientData]);

    useEffect(() => {
        fetchMessages();
    }, []);

    useEffect(() => {
        const fetchRecipientData = async () => {
            try {
                const response = await fetch(
                    `${MAIN_API_APP}/user/${recipientId}`
                );

                const data = response.json();
                setRecipientData(data);
            } catch (err) {
                console.log("Error Retrieving Details", err);
            }

            fetchRecipientData();
        };
    }, []);

    useEffect(() => {
        scrollToBottom();
    }, []);

    return (
        <KeyboardAvoidingView
            style={{ flex: 1, backgroundColor: colors.screenBG }}
        >
            <ScrollView
                ref={scrollViewRef}
                contentContainerStyle={{ flexGrow: 1 }}
                onContentSizeChange={handleContentSizeChange}
            >
                {messages.map((item, index) => {
                    if (item.messageType === "text") {
                        return (
                            <Pressable
                                key={index}
                                style={[
                                    item?.senderId?._id === userId
                                        ? {
                                              alignSelf: "flex-end",
                                              backgroundColor:
                                                  colors.lightYellow,
                                              padding: 8,
                                              maxWidth: "60%",
                                              borderRadius: 7,
                                              margin: 10,
                                          }
                                        : {
                                              alignSelf: "flex-start",
                                              backgroundColor: colors.white,
                                              padding: 8,
                                              margin: 10,
                                              maxWidth: "60%",
                                              borderRadius: 7,
                                          },
                                ]}
                            >
                                <Text
                                    style={{ fontSize: 13, textAlign: "left" }}
                                >
                                    {item?.message}
                                </Text>

                                <Text
                                    style={{
                                        textAlign: "right",
                                        fontSize: 9,
                                        color: colors.gray,
                                        marginTop: 5,
                                    }}
                                >
                                    {formatTime(item?.timeStamp)}
                                </Text>
                            </Pressable>
                        );
                    }

                    if (item.messageType === "image") {
                        const imageUrl = item.imageUrl;
                        const filename = imageUrl.split("/").pop();
                        const source = { uri: filename };

                        return (
                            <Pressable
                                key={index}
                                style={[
                                    item?.senderId?._id === userId
                                        ? {
                                              alignSelf: "flex-end",
                                              backgroundColor:
                                                  colors.lightYellow,
                                              padding: 8,
                                              maxWidth: "60%",
                                              borderRadius: 7,
                                              margin: 5,
                                              color: colors.black,
                                          }
                                        : {
                                              alignSelf: "flex-start",
                                              backgroundColor: colors.white,
                                              padding: 8,
                                              margin: 5,
                                              maxWidth: "60%",
                                              borderRadius: 7,
                                              color: colors.black,
                                          },
                                ]}
                            >
                                <View>
                                    <Image
                                        source={source}
                                        style={{
                                            width: 200,
                                            height: 200,
                                            borderRadius: 7,
                                        }}
                                    />

                                    <Text
                                        style={{
                                            textAlign: "right",
                                            fontSize: 9,
                                            color: colors.white,
                                            position: "absolute",
                                            right: 10,
                                            marginTop: 5,
                                            bottom: 7,
                                        }}
                                    >
                                        {formatTime(item?.timeStamp)}
                                    </Text>
                                </View>
                            </Pressable>
                        );
                    }
                })}
            </ScrollView>

            <View
                style={{
                    flexDirection: "row",
                    alignItems: "center",
                    paddingHorizontal: 10,
                    paddingVertical: 10,
                    borderTopWidth: 1,
                    borderTopColor: "#dddddd",
                    marginBottom: showEmojiSelector ? 0 : 25,
                }}
            >
                <Entypo
                    onPress={handleEmojiSelector}
                    style={{ marginRight: 15 }}
                    name="emoji-happy"
                    size={24}
                    color={colors.gray}
                />

                <TextInput
                    value={message}
                    onChangeText={(text) => setMessage(text)}
                    style={{
                        flex: 1,
                        height: 40,
                        borderWidth: 1,
                        borderColor: "#dddddd",
                        borderRadius: 20,
                        paddingHorizontal: 10,
                    }}
                    placeholder="Type Your Message..."
                />

                <View
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 7,
                        marginHorizontal: 8,
                    }}
                >
                    <Entypo
                        onPress={pickImage}
                        name="camera"
                        size={24}
                        color={colors.gray}
                    />

                    <Feather name="mic" size={24} color={colors.gray} />
                </View>

                <Pressable
                    onPress={() => handleSend("text")}
                    style={{
                        backgroundColor: colors.secondBlue,
                        paddingVertical: 8,
                        paddingHorizontal: 12,
                        borderRadius: 20,
                        marginLeft: 10,
                    }}
                >
                    <Text style={{ color: colors.white, fontWeight: "bold" }}>
                        Send
                    </Text>
                </Pressable>
            </View>

            {showEmojiSelector && (
                <EmojiSelector
                    onEmojiSelected={(emoji) => setMessage((preMessage) => preMessage + emoji)}
                    style={{ height: 250 }}
                />
            )}
        </KeyboardAvoidingView>
    );
};

export default ChatMessageScreen;
