import React, {useState} from 'react';
import {
    Image, KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";
import {StatusBar} from "expo-status-bar";
import {router} from "expo-router";
import {Ionicons} from "@expo/vector-icons";
import {COLORS, SIZES} from "../constants/theme";
import * as navigation from "expo-router/build/global-state/routing";

const ForgotPassword = () => {
    const [email, setEmail] = useState("");

    const handleVerification = () => {
        alert(email);
        navigation.navigate('verification');
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
                        <TouchableOpacity onPress={() => router.push('login')} style={styles.backBtn}>
                            <Ionicons name="arrow-back" style={styles.icon} />
                        </TouchableOpacity>
                        <View style={styles.header}>
                            <Image
                                source={require('../assets/images/email.jpeg')}
                                style={styles.login_image}
                                resizeMode="contain"
                            />
                        </View>
                        <View style={styles.login_header}>
                            <Text style={styles.boldText}>Recovery Password</Text>
                            <Text style={styles.smallText}>Enter your email address to change your password</Text>
                        </View>
                        <View style={styles.login_form}>
                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Email</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="e.g. john.doe@ktu.edu.gh"
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                    value={email}
                                    onChangeText={setEmail}
                                />
                            </View>

                            <TouchableOpacity style={{width:'100%'}} onPress={() => handleVerification()}>
                                <Text style={styles.startBtn}>Continue</Text>
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

export default ForgotPassword;
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
