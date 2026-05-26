import {
    View,
    Text,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Image, TouchableOpacity,} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {Link, router, useLocalSearchParams} from "expo-router";
import { COLOR, TEXT } from "../../utils/theme";
import { StatusBar } from "expo-status-bar";
import React, {useEffect, useRef, useState} from "react";
import FullScreenLoader from "../../components/common/fullScreenLoader";
import DLMInput from "../../components/common/DLMInput";
import DLMButton from "../../components/common/DLMButton";
import Copyright from "../../components/common/copyright";
import {moderateScale, verticalScale, normalize,} from "../../utils/scale";
import {useToast} from "../../components/common/ToastProvider";
import {useAuthStore} from "../../utils/useAuthStore";
import BASE_URL from "../../utils/url";
import DLMOTPInput from "../../components/common/DLMOTPInput";

export default function SignIn() {
    const {logIn, logInAsAdmin, setUser} = useAuthStore();
    const [step, setStep] = useState("login");

    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { showToast } = useToast();


    const [loginEmail, setLoginEmail] = useState("");
    const otpRef = useRef(null);
    const [otpCode, setOtpCode] = useState("");


    const submitLogin = async () => {
        if (email === "" || password === "") {
            showToast({
                type: "error",
                message: "Enter email and password to sign in.",
            });
            return;
        }

        setLoading(true);
        try {
            // call API here
            const payload = {
                email: email,
                password: password,
            }

            const response = await fetch(BASE_URL.online+'/auth/login', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload)
            });

            const data = await response.json();

            console.log(data);

            if (data?.status === 200) {
                setEmail("");
                setPassword("");
                showToast({
                    type: "success",
                    message: "Welcome to SchoolPal!",
                });
                setUser(data?.data);
                data?.data?.role === "admin" ? logInAsAdmin() : logIn()
                router.replace("/(tabs)");
            }else if(data?.status === 401){
                showToast({
                    type: "error",
                    message: data?.message,
                });
            }else if(data?.status === 300){
                setEmail("");
                setPassword("");
                setLoginEmail(email)
                setStep("verify")
                showToast({
                    type: "warning",
                    message: data?.message,
                });
            }else{
                showToast({
                    type: "error",
                    message: "Something went wrong. Please try again later.",
                });
            }
        } catch (err) {
            console.log(err)
        } finally {
            setLoading(false);
        }
    };

    const submitVerification = async () => {
        if (otpCode.length < 4) {
            showToast({
                type: "error",
                message: "Enter the complete verification code.",
            });
            return;
        }
        setLoading(true);
        try {
            const payload = {
                email: loginEmail,
                otp: otpCode,
            }
            const response = await fetch(BASE_URL.online+'/verify-otp', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload)
            });
            const data = await response.json();


            if (data.status === 200) {
                showToast({
                    type: "success",
                    message: data.message,
                });
                setOtpCode("");
                otpRef.current?.clear();

                setUser(data?.data);
                data?.data?.role === "admin" ? logInAsAdmin() : logIn()
                router.replace("/(tabs)");
            }else if (data.status === 400){
                setOtpCode("");
                otpRef.current?.clear();
                showToast({
                    type: "error",
                    message: data.message,
                });
            }

        }catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    const backToSignIn = ()=> {
        setStep("login")
        setOtpCode("");
        otpRef.current?.clear();
    }

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar style="light" />


            <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ flexGrow: 1 }}
                    keyboardShouldPersistTaps="handled"
                >
                    <View style={styles.wrapper}>

                        {/* TOP + FORM */}
                        <View>
                            <View style={styles.top}>
                                <Image
                                    source={require('../../../assets/logo/logo.png')}
                                    style={styles.image}
                                    resizeMode="contain"
                                />
                                <Text style={styles.appName}>
                                    KTU FEES PAY
                                </Text>
                            </View>

                            {step === "login" && (
                                <View style={styles.middle}>
                                    <View style={styles.formInfo}>
                                        <Text style={[TEXT.Title, { textAlign: "center", color: "#fff" }]}>
                                            Sign In
                                        </Text>
                                        <Text style={[TEXT.Body, { textAlign: "center", color: "#fff" }]}>
                                            Enter your email and password to sign in to KTU fees pay.
                                        </Text>
                                    </View>

                                    <View style={styles.inputForm}>
                                        <View>

                                            <DLMInput
                                                icon="mail-send-fill"
                                                placeholder="Enter your email"
                                                keyboardType="email-address"
                                                maxLength={100}
                                                value={email}
                                                onChangeText={setEmail}
                                            />
                                        </View>

                                        <DLMInput
                                            icon="lock-2-fill"
                                            placeholder="Enter your password"
                                            secure={true}
                                            maxLength={100}
                                            value={password}
                                            onChangeText={setPassword}
                                        />

                                        <DLMButton
                                            title="Sign In"
                                            variant="solid"
                                            disabled={loading}
                                            loading={loading}
                                            onPress={submitLogin}
                                        />

                                        <TouchableOpacity
                                            onPress={() => router.push("/auth/forgot-password")}
                                            style={styles.forgotPassword}
                                        >
                                            <Text style={styles.forgotPasswordText}>
                                                Forgot your password?
                                            </Text>
                                        </TouchableOpacity>

                                    </View>
                                </View>
                            )}

                            {step === "verify" && (
                                <View style={styles.middle}>
                                    <View style={styles.formInfo}>
                                        <Text style={[TEXT.Title, { textAlign: "center" }]}>
                                            Account Verification
                                        </Text>
                                        <Text style={[TEXT.Body, { textAlign: "center" }]}>
                                            Enter the OPT sent to your email to verify your account.
                                        </Text>
                                    </View>

                                    <View style={styles.inputForm}>

                                        <DLMOTPInput
                                            ref={otpRef}
                                            length={4}
                                            onComplete={(code) => {
                                                setOtpCode(code);
                                            }}
                                        />

                                        <DLMButton
                                            title="Verify Account"
                                            variant="solid"
                                            disabled={loading}
                                            loading={loading}
                                            onPress={submitVerification}
                                        />

                                    </View>

                                </View>
                            )}

                            {step === "verify" && (
                                <View style={styles.backToSignIn}>
                                    <DLMButton
                                        title="Back to Sign In"
                                        variant="outline"
                                        onPress={(backToSignIn)}
                                    />
                                </View>
                            )}

                        </View>

                        {/* FOOTER */}
                        <View style={styles.footer}>
                            <Copyright />
                        </View>

                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLOR.primary,
    },

    wrapper: {
        flex: 1,
        paddingHorizontal: verticalScale(20),
        justifyContent: "space-between",
    },

    top: {
        justifyContent: "center",
        alignItems: "center",
        marginBottom: verticalScale(20),
    },

    appName: {
        fontSize: 20,
        fontFamily: "PoppinsExtraBold",
        fontStyle: 900,
        color: COLOR.secondary,
    },

    image: {
        width: moderateScale(100),
        height: moderateScale(100),
        marginBottom: verticalScale(5),
        marginTop: verticalScale(40),
    },

    middle: {
        alignItems: "center",
    },

    formInfo: {
        gap: moderateScale(10),
        marginBottom: verticalScale(20),
    },

    errorText: {
        color: "#FF0000",
    },

    inputForm: {
        gap: moderateScale(20),
        width: "100%",
    },

    forgotPassword: {
        marginTop: verticalScale(20),
        marginBottom: verticalScale(40),
        alignItems: "flex-end",
    },

    forgotPasswordText: {
        color: COLOR.secondary,
        fontSize: moderateScale(18)
    },

    register: {
        flexDirection: "row",
        alignItems: "center",
        gap: moderateScale(10),
        marginTop: verticalScale(20),
    },

    backToSignIn: {
        marginTop: verticalScale(20),
    },

    footer: {
        alignItems: "center",
        justifyContent: "flex-end",
    },
});