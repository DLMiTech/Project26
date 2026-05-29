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
import {AnimatedCircularProgress} from "react-native-circular-progress";

export default function SignIn() {
    const {logIn, logInAsAdmin, setUser} = useAuthStore();
    const [step, setStep] = useState("login");
    const [timeLeft, setTimeLeft] = useState(300);
    const [showTimer, setShowTimer] = useState(true);

    const [loading, setLoading] = useState(false);
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const { showToast } = useToast();


    const [loginPhone, setLoginPhone] = useState("");
    const otpRef = useRef(null);
    const [otpCode, setOtpCode] = useState("");


    const submitLogin = async () => {
        if (phone === "" || password === "") {
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
                phone: phone,
                password: password,
            }

            // const response = await fetch(BASE_URL.online+'/login', {
            //     method: "POST",
            //     headers: {
            //         "Content-Type": "application/json",
            //     },
            //     body: JSON.stringify(payload)
            // });
            // const data = await response.json();

            const data = {
                status: 200,
                message: "Successfully logged in",
                data: {
                    phone:"0559574121",
                }
            }

            if (data?.status === 200) {
                setPhone("");
                setPassword("");
                setLoginPhone(phone)
                setStep("verify")
                setTimeLeft(300);
                setShowTimer(true);
                showToast({
                    type: "warning",
                    message: data?.message,
                });
            }else if(data?.status === 401){
                showToast({
                    type: "error",
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




    useEffect(() => {
        if (!showTimer) return;

        if (timeLeft === 0) {
            setShowTimer(false);
            return;
        }

        const interval = setInterval(() => {
            setTimeLeft((t) => t - 1);
        }, 1000);

        return () => clearInterval(interval);
    }, [timeLeft, showTimer]);


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
                phone: loginPhone,
                otp: otpCode,
            }
            // const response = await fetch(BASE_URL.online+'/verify-otp', {
            //     method: "POST",
            //     headers: {
            //         "Content-Type": "application/json",
            //     },
            //     body: JSON.stringify(payload)
            // });
            // const data = await response.json();


            const data = {
                status: 200,
                data: {
                    token: "sfhcdshf746574nsbcdsc",
                    user: {
                        wallet: {
                            balance: 10000,
                            transactions: [

                            ],
                        },
                        id: 1,
                        name: "Lukeman Dramani",
                        username: "lukeman",
                        phone: "0559574121",
                        role: "user",
                        type: "three",
                    },
                },
                message: "Verification successfully.",
            }


            if (data.status === 200) {
                showToast({
                    type: "success",
                    message: data.message,
                });
                setOtpCode("");
                otpRef.current?.clear();
                setShowTimer(false);

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

    const handleResendCode  =  async () => {
        if (showTimer) return;

        setLoading(true);

        try {
            // const response = await fetch(BASE_URL.online + "/resend-otp", {
            //     method: "POST",
            //     headers: {
            //         "Content-Type": "application/json",
            //     },
            //     body: JSON.stringify({
            //         phone: loginPhone,
            //     })
            // });
            // const data = await response.json();

            const data = {
                status: 200,
                message: "Verification code resend.",
            }

            if (data.status === 200) {
                showToast({
                    type: "success",
                    message: data.message,
                });
                // Reset OTP boxes
                setOtpCode("");
                otpRef.current?.clear();

                // Reset timer
                setTimeLeft(300);
                setShowTimer(true);
            } else {
                showToast({
                    type: "error",
                    message: data.message,
                });
            }

        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    }

    const backToSignIn = ()=> {
        setStep("login")
        setOtpCode("");
        otpRef.current?.clear();
    }

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar style="dark" />

            <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ flexGrow: 1 }}
                    keyboardShouldPersistTaps="handled"
                >
                    <View style={styles.wrapper}>

                        {/* TOP + FORM */}
                        <View>

                            {step === "login" && (
                                <View style={styles.middle}>
                                    <View style={styles.top}>
                                        <Image
                                            source={require('../../../assets/logo/logo-wb.png')}
                                            style={styles.image}
                                            resizeMode="contain"
                                        />
                                    </View>

                                    <View style={styles.formInfo}>
                                        <Text style={[TEXT.Title, { textAlign: "center" }]}>
                                            Sign In
                                        </Text>
                                        <Text style={[TEXT.Body, { textAlign: "center" }]}>
                                            Enter your email and password to sign in to SchoolPal.
                                        </Text>
                                    </View>

                                    <View style={styles.inputForm}>
                                        <View>

                                            <DLMInput
                                                icon="phone-fill"
                                                placeholder="Enter your phone"
                                                keyboardType="number-pad"
                                                maxLength={15}
                                                value={phone}
                                                onChangeText={setPhone}
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
                                            onPress={submitLogin}
                                        />

                                        <DLMButton
                                            title="Sign Up"
                                            variant="outline"
                                            onPress={() => router.push("/auth/sign-up")}
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
                                    <View style={styles.top}>
                                        <Image
                                            source={require('../../../assets/logo/logo-wb.png')}
                                            style={styles.image}
                                            resizeMode="contain"
                                        />
                                    </View>


                                    <View style={styles.formInfo}>
                                        <Text style={[TEXT.Title, { textAlign: "center" }]}>
                                            Account Verification
                                        </Text>
                                        <Text style={[TEXT.Body, { textAlign: "center" }]}>
                                            Enter the OPT sent to your phone to verify your account.
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
                                            onPress={submitVerification}
                                        />

                                    </View>

                                    {showTimer ? (
                                        <View style={{display: "flex", flexDirection: 'column', alignItems: 'center', gap: 10, marginTop: 20}}>
                                            <Text style={TEXT.Caption}>Code expires in</Text>

                                            <AnimatedCircularProgress
                                                size={50}
                                                width={6}
                                                fill={(timeLeft / 300) * 100}
                                                tintColor="#f3860f"
                                                backgroundColor="#ddd"
                                                rotation={0}
                                            >
                                                {
                                                    () => (
                                                        <Text style={{ fontSize: 12, fontWeight: "500" }}>
                                                            {timeLeft}s
                                                        </Text>
                                                    )
                                                }
                                            </AnimatedCircularProgress>
                                        </View>

                                    ) : (
                                        <View style={{display:'flex', flexDirection: 'row', justifyContent:'center', gap: 10, alignItems: 'center', marginTop: 20}}>
                                            <Text style={TEXT.Caption}>Resend code?</Text>
                                            <TouchableOpacity onPress={() => handleResendCode()}>
                                                <Text style={TEXT.Caption}>Resend</Text>
                                            </TouchableOpacity>
                                        </View>
                                    )}
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
        backgroundColor: COLOR.white,
    },

    wrapper: {
        flex: 1,
        paddingHorizontal: verticalScale(20),
        justifyContent: "space-between",
    },

    top: {
        justifyContent: "center",
        alignItems: "center",
    },

    image: {
        width: moderateScale(120),
        height: moderateScale(140),
        marginBottom: verticalScale(20),
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
        color: COLOR.primary,
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