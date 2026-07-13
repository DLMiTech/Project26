import React, {useState} from 'react';
import {
    Image,
    KeyboardAvoidingView,
    SafeAreaView, ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    Platform,
    View
} from "react-native";
import {COLORS, SHADOW, SIZES} from "../constants/init";
import {router} from "expo-router";
import {Ionicons} from "@expo/vector-icons";
import {StatusBar} from "expo-status-bar";
import * as navigation from "expo-router/build/global-state/routing";

const Index = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = () => {
        alert(email+" "+password);
        navigation.navigate("home");
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

                        <View style={styles.header}>
                            <Image
                                source={require('../assets/images/login.jpeg')}
                                style={styles.login_image}
                                resizeMode="contain"
                            />
                        </View>
                        <View style={styles.login_header}>
                            <Text style={styles.boldText}>Sign In To You Account</Text>
                            <Text style={styles.smallText}>Enter your email address and password to login</Text>
                        </View>
                        <View style={styles.login_form}>
                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Email Address</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="e.g. john.doe@ktu.edu.gh"
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                    value={email}
                                    onChangeText={setEmail}
                                />
                            </View>

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

                            <TouchableOpacity style={{width:'100%'}} onPress={() => handleLogin()}>
                                <Text style={styles.startBtn}>Login now</Text>
                            </TouchableOpacity>


                            <View style={styles.forgotPassword}>
                                <TouchableOpacity onPress={() => router.replace("/forgot_password")}>
                                    <Text style={styles.label}>Forgot password?</Text>
                                </TouchableOpacity>
                            </View>

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

export default Index;
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.white,
    },
    wrapper: {
        flex: 1,
        paddingHorizontal: 20,
    },
    header: {
        alignItems: "center",
        marginTop: 30
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
        textAlign: "center",
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