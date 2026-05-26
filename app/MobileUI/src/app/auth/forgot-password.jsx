import React, {useEffect, useRef, useState} from 'react';
import {
    Text,
    View,
    StyleSheet,
    TouchableOpacity,
    Image,
    KeyboardAvoidingView,
    Platform,
    ScrollView
} from "react-native";
import {router} from "expo-router";
import RemixIcon from "react-native-remix-icon";
import {COLOR, TEXT} from "../../utils/theme";
import DLMInput from "../../components/common/DLMInput";
import Copyright from "../../components/common/copyright";
import {moderateScale, verticalScale, normalize,} from "../../utils/scale";
import DLMButton from "../../components/common/DLMButton";
import FullScreenLoader from "../../components/common/fullScreenLoader";
import DLMOTPInput from "../../components/common/DLMOTPInput";
import {useToast} from "../../components/common/ToastProvider";
import {StatusBar} from "expo-status-bar";
import {SafeAreaView} from "react-native-safe-area-context";
import BASE_URL from "../../utils/url";
import {AnimatedCircularProgress} from "react-native-circular-progress";
import Validator from "../../utils/Validator";

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));


const ForgotPassword = () => {
    const [timeLeft, setTimeLeft] = useState(300);
    const [showTimer, setShowTimer] = useState(true);
    const [step, setStep] = useState("email");
    const [loading, setLoading] = useState(false);
    const { showToast } = useToast();

    const [token, setToken] = useState("");
    const [errorMessages, setErrorMessages] = useState({});
    const otpRef = useRef(null);
    const [email, setEmail] = useState("");
    const [otpCode, setOtpCode] = useState("");
    const [password, setPassword] = useState("");


    const submitForgotPassword = async () => {
        if (email === "") {
            showToast({
                type: "error",
                message: "Enter email to reset password.",
            });
            return;
        }
        setLoading(true);
        try {
            const payload = {
                email: email,
            }

            const response = await fetch(BASE_URL.online+'/forgot-password', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload)
            });
            const data = await response.json();

            if (data?.status === 200) {
                showToast({
                    type: "success",
                    message: data?.message,
                });
                setTimeLeft(300);
                setShowTimer(true);
                setStep("verify");
            }else if(data?.status === 422){
                setErrorMessages(data.data);
                showToast({
                    type: "error",
                    message: data?.message,
                });
            }else if (data.status === 500){
                showToast({
                    type: "error",
                    message: data?.message,
                });
            }else {
                showToast({
                    type: "warning",
                    message: data?.message,
                });
            }

        } catch (err) {
            console.log(err);
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
                email: email,
                otp: otpCode,
            }
            const response = await fetch(BASE_URL.online+'/verify-forgot-password-otp', {
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
                setShowTimer(false);
                setToken(data?.data?.token);
                setStep("reset");
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


    const handleResendCode  =  async () => {
        if (showTimer) return;

        setLoading(true);

        try {
            const response = await fetch(BASE_URL.online + "/resend-forgot-password-otp", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: email,
                })
            });
            const data = await response.json();

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






    const submitResetPassword = async () => {
        if (password === "") {
            showToast({
                type: "error",
                message: "Enter password to reset password.",
            });
            return;
        }
        const validatePassword = Validator.password(password);
        if (!validatePassword.status) {
            showToast({
                type: "warning",
                message: validatePassword.message,
            });
            return;
        }
        setLoading(true);

        try {
            const payload = {
                token: token,
                password: password,
                password_confirmation: password,
            }
            const response = await fetch(BASE_URL.online+'/reset-password', {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload)
            });
            const data = await response.json();

            if (data?.status === 200) {
                showToast({
                    type: "success",
                    message: data?.message,
                });
                router.back();
            }else if(data?.status === 422){
                showToast({
                    type: "error",
                    message: data?.data?.token[0],
                });
            }else {
                showToast({
                    type: "error",
                    message: data?.message,
                });
            }

        }catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    };
    return (
        <>
            <SafeAreaView style={styles.container}>
                <StatusBar style="dark" />

                {loading && (
                    <FullScreenLoader text="Submiting data, please wait..." />
                )}

                <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ flexGrow: 1 }}
                        keyboardShouldPersistTaps="handled"
                    >
                        <View style={styles.wrapper}>
                            {/* TOP + FORM */}
                            <View>
                                <TouchableOpacity
                                    onPress={() => {
                                        if (router.canGoBack()) {
                                            router.back();
                                        } else {
                                            router.push("/");
                                        }
                                    }} style={styles.backButton}>
                                    <RemixIcon name={`arrow-left-long-line`} size={22} color="#595959"/>
                                </TouchableOpacity>


                                {step === "email" && (
                                    <View style={styles.middle}>
                                        <View style={styles.top}>
                                            <Image
                                                source={require('../../../assets/auth-icon/forgot.png')}
                                                style={styles.image}
                                                resizeMode="contain"
                                            />
                                        </View>


                                        <View style={styles.formInfo}>
                                            <Text style={[TEXT.Title, { textAlign: "center" }]}>
                                                Forgot Password?
                                            </Text>
                                            <Text style={[TEXT.Body, { textAlign: "center" }]}>
                                                Enter your email and password to sign in to SchoolPal.
                                            </Text>
                                        </View>

                                        <View style={styles.inputForm}>

                                            <View>
                                                {errorMessages.email && (
                                                    <Text style={styles.errorText}>
                                                        {errorMessages.email[0]}
                                                    </Text>
                                                )}
                                                <DLMInput
                                                    icon="mail-send-fill"
                                                    placeholder="Enter your email"
                                                    keyboardType="email-address"
                                                    maxLength={100}
                                                    value={email}
                                                    onChangeText={(text) => {
                                                        setEmail(text);
                                                        setErrorMessages(prev => ({
                                                            ...prev,
                                                            email: null
                                                        }));
                                                    }}
                                                    error={!!errorMessages.email}
                                                />
                                            </View>

                                            <DLMButton
                                                title="Restore Password"
                                                variant="solid"
                                                disabled={loading}
                                                onPress={submitForgotPassword}
                                            />

                                        </View>
                                    </View>
                                )}

                                {step === "verify" && (
                                    <View style={styles.middle}>
                                        <View style={styles.top}>
                                            <Image
                                                source={require('../../../assets/auth-icon/verify.png')}
                                                style={styles.image}
                                                resizeMode="contain"
                                            />
                                        </View>


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
                                                    tintColor="#005AD4"
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

                                {step === "reset" && (
                                    <View style={styles.middle}>
                                        <View style={styles.top}>
                                            <Image
                                                source={require('../../../assets/auth-icon/sign-in.png')}
                                                style={styles.image}
                                                resizeMode="contain"
                                            />
                                        </View>


                                        <View style={styles.formInfo}>
                                            <Text style={[TEXT.Title, { textAlign: "center" }]}>
                                                Reset Password
                                            </Text>
                                            <Text style={[TEXT.Body, { textAlign: "center" }]}>
                                                Enter a new password to reset your account.
                                            </Text>
                                        </View>

                                        <View style={styles.inputForm}>

                                            <DLMInput
                                                icon="lock-2-fill"
                                                placeholder="Enter new password"
                                                secure={true}
                                                keyboardType="password"
                                                maxLength={100}
                                                value={password}
                                                onChangeText={setPassword}
                                            />

                                            <DLMButton
                                                title="Reset Password"
                                                variant="solid"
                                                disabled={loading}
                                                onPress={submitResetPassword}
                                            />

                                        </View>
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
        </>
    );
};

export default ForgotPassword;

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
        width: moderateScale(80),
        height: moderateScale(80),
        marginBottom: verticalScale(20),
        marginTop: verticalScale(40),
    },

    errorText: {
        fontSize: moderateScale(12),
        textAlign: "right",
        marginBottom: verticalScale(5),
        color: "#e5383b"
    },
    middle: {
        alignItems: "center",
    },

    formInfo: {
        gap: moderateScale(10),
        marginBottom: verticalScale(20),
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

    footer: {
        alignItems: "center",
        justifyContent: "flex-end",
    },
    backButton: {
        position: "absolute",
        top: verticalScale(10),
        zIndex: 10,
        padding: 10,
        borderWidth: 1,
        borderRadius: 100,
        borderColor: COLOR.textLight,
    }
});