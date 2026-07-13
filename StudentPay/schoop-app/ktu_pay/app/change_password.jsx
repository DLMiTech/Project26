import React, {useState} from 'react';
import {
    Image,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    ScrollView, StyleSheet,
    Text, TextInput,
    TouchableOpacity,
    View
} from "react-native";
import {StatusBar} from "expo-status-bar";
import {router} from "expo-router";
import {Ionicons} from "@expo/vector-icons";
import {COLORS, SIZES} from "../constants/theme";
import * as navigation from "expo-router/build/global-state/routing";

const ChangePassword = () => {
    const [password, setPassword] = useState("");
    const [cPassword, setCPassword] = useState("");

    const handleChangePassword = () => {
        alert(password+" "+cPassword);
        navigation.navigate("login");

    };
    return (
        <SafeAreaView style={styles.container}>
            <StatusBar style={'dark'} />
            <KeyboardAvoidingView style={{ flex: 1}}
                                  behavior={Platform.OS === "ios" ? "padding" : "height"}>
                <ScrollView
                    contentContainerStyle={{ flexGrow: 1}}
                    keyboardShouldPersistTaps="handled"
                >
                    <View style={styles.wrapper}>
                        <TouchableOpacity onPress={() => router.replace('/')} style={styles.backBtn}>
                            <Ionicons name="arrow-back" style={styles.icon} />
                        </TouchableOpacity>
                        <View style={styles.header}>
                            <Image
                                source={require('../assets/images/password.jpeg')}
                                style={styles.login_image}
                                resizeMode="contain"
                            />
                        </View>
                        <View style={styles.login_header}>
                            <Text style={styles.boldText}>Create New Password</Text>
                            <Text style={styles.smallText}>Choose a new password and confirm it to complete the process.</Text>
                        </View>
                        <View style={styles.login_form}>


                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Password</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Enter password"
                                    secureTextEntry
                                    value={password}
                                    onChangeText={setPassword}
                                />
                            </View>

                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Confirm password</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Enter password"
                                    secureTextEntry
                                    value={cPassword}
                                    onChangeText={setCPassword}
                                />
                            </View>

                            <TouchableOpacity style={{width:'100%'}} onPress={() => handleChangePassword()}>
                                <Text style={styles.startBtn}>Change Password</Text>
                            </TouchableOpacity>

                        </View>

                        <View style={styles.footer}>
                            <Text style={styles.footerText}>Copy right @ 2025</Text>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

export default ChangePassword;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.white,
    },
    wrapper: {
        flex: 1,
        paddingHorizontal: 20,
    },
    backBtn: {
        width: 30,
        height: 30,
        borderRadius: 5,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: COLORS.primary,
    },
    icon:{
        fontSize: 18,
        color: COLORS.white
    },
    header: {
        alignItems: "center",
    },
    login_image: {
        width: 250,
        height: 250,
    },
    login_header: {
        alignItems: "center",
    },
    boldText: {
        fontSize: SIZES.xLarge,
        fontFamily: "extraBold",
        color: COLORS.primary,
    },
    smallText: {
        fontSize: SIZES.medium,
        color: COLORS.gray,
        marginBottom: 20,
        textAlign: "center"
    },
    login_form: {
        paddingHorizontal: 10,
        paddingVertical: 30,
        borderWidth: 1,
        borderRadius: 5,
        borderColor: COLORS.lightGray,
        backgroundColor: "#f9f9f9",
    },
    inputGroup: {
        marginBottom: 20,
    },
    label: {
        fontSize: SIZES.medium,
        color: COLORS.darkGray,
        marginBottom: 5,
    },
    input: {
        borderWidth: 1,
        borderColor: COLORS.lightGray,
        borderRadius: 8,
        padding: 12,
        fontSize: SIZES.medium,
        backgroundColor: COLORS.white,
    },
    startBtn: {
        backgroundColor: COLORS.primary,
        color: COLORS.white,
        paddingVertical: 12,
        paddingHorizontal: 40,
        borderRadius: 5,
        fontWeight: "bold",
        fontSize: 16,
        width: '100%',
        textAlign: "center",
    },
    forgotPassword: {
        display: "flex",
        flexDirection: "row",
        gap: 10,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 20,
    },
    footer:{
        position: "absolute",
        bottom: 20,
        right: 0,
        left: 0,
        alignItems: "center",
    },
    footerText: {
        fontSize: SIZES.medium,
        color: COLORS.gray,
    }
})
