import React, {useRef, useState} from 'react';
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

const Verification = () => {
    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const inputs = useRef([]);

    const handleChange = (text, index) => {
        if (/^\d?$/.test(text)) {
            const updatedOtp = [...otp];
            updatedOtp[index] = text;
            setOtp(updatedOtp);

            if (text && index < 5) {
                inputs.current[index + 1].focus();
            }
        }
    };

    const handleKeyPress = ({ nativeEvent }, index) => {
        if (nativeEvent.key === "Backspace" && otp[index] === "" && index > 0) {
            inputs.current[index - 1].focus();
        }
    };

    const handleContinue = () => {
        const code = otp.join("");

        alert(code)
        navigation.navigate("change_password");
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
                        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                            <Ionicons name="arrow-back" style={styles.icon} />
                        </TouchableOpacity>
                        <View style={styles.header}>
                            <Image
                                source={require('../assets/images/otp.jpeg')}
                                style={styles.login_image}
                                resizeMode="contain"
                            />
                        </View>
                        <View style={styles.login_header}>
                            <Text style={styles.boldText}>Account Verification</Text>
                            <Text style={styles.smallText}>Enter the OTP sent to your email to verify your identity</Text>
                        </View>
                        <View style={styles.login_form}>
                            <Text style={styles.label}>OTP Code</Text>
                            <View style={styles.otpContainer}>
                                {otp.map((digit, index) => (
                                    <TextInput
                                        key={index}
                                        ref={(ref) => (inputs.current[index] = ref)}
                                        value={digit}
                                        onChangeText={(text) => handleChange(text, index)}
                                        onKeyPress={(e) => handleKeyPress(e, index)}
                                        keyboardType="number-pad"
                                        maxLength={1}
                                        style={styles.otpInput}
                                        autoFocus={index === 0}
                                    />
                                ))}
                            </View>

                            <TouchableOpacity style={{ width: "100%" }} onPress={handleContinue}>
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

export default Verification;
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
    label: {
        fontSize: SIZES.medium,
        color: COLORS.darkGray,
        marginBottom: 5,
    },
    otpContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 20,
        gap: 10,
    },
    otpInput: {
        borderWidth: 1,
        borderColor: COLORS.lightGray,
        borderRadius: 8,
        backgroundColor: COLORS.white,
        width: 50,
        height: 55,
        textAlign: "center",
        fontSize: 20,
        fontWeight: "bold",
        color: COLORS.primary,
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

