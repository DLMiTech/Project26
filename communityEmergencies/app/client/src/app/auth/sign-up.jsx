import {
    View,
    Text,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    TouchableOpacity, Image
} from "react-native";
import {router, useLocalSearchParams} from "expo-router";
import {SafeAreaView} from "react-native-safe-area-context";
import {StatusBar} from "expo-status-bar";
import {COLOR, TEXT} from "../../utils/theme";
import React, {useEffect, useRef, useState} from "react";
import FullScreenLoader from "../../components/common/fullScreenLoader";
import DLMInput from "../../components/common/DLMInput";
import DLMButton from "../../components/common/DLMButton";
import Copyright from "../../components/common/copyright";
import {moderateScale, verticalScale} from "../../utils/scale";
import RemixIcon from "react-native-remix-icon";
import {useToast} from "../../components/common/ToastProvider";
import DLMOTPInput from "../../components/common/DLMOTPInput";
import {useAuthStore} from "../../utils/useAuthStore";
import Validator from "../../utils/Validator";
import BASE_URL from "../../utils/url";
import {AnimatedCircularProgress} from "react-native-circular-progress";


export default function SignUp(){
    const [timeLeft, setTimeLeft] = useState(300);
    const [showTimer, setShowTimer] = useState(true);
    const [step, setStep] = useState("register");
    const [loading, setLoading] = useState(false);
    const { showToast } = useToast();
    const {logIn, logInAsAdmin, setUser} = useAuthStore();


    const [errorMessages, setErrorMessages] = useState({});
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");


    const [registeredEmail, setRegisteredEmail] = useState("");
    const otpRef = useRef(null);
    const [otpCode, setOtpCode] = useState("");

    const submitRegister = async () => {
        if (email === "" || password === "" || name === "" || phone === ""){
            showToast({
                type: "warning",
                message: "All fields are required to sign up.",
            });
            return;
        }
        const validateName = Validator.name(name);
        if (!validateName.status) {
            showToast({
                type: "warning",
                message: validateName.message,
            });
            return;
        }
        const validateEmail = Validator.email(email);
        if (!validateEmail.status) {
            showToast({
                type: "warning",
                message: validateEmail.message,
            });
            return;
        }
        const validatePhone = Validator.phone(phone);
        if (!validatePhone.status) {
            showToast({
                type: "warning",
                message: validatePhone.message,
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
            // call API here
            const payload = {
                name: name,
                email: email,
                phone: phone,
                password: password,
                password_confirmation: password,
            }

            const response = await fetch(BASE_URL.online+'/register', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload)
            });
            const data = await response.json();

            if (data.status === 200) {
                setRegisteredEmail(data?.data?.email)
                setName("")
                setEmail("")
                setPhone("")
                setPassword("")
                setStep("verify");
                setTimeLeft(300);
                setShowTimer(true);
                showToast({
                    type: "success",
                    message: data?.message,
                });
            }else if (data.status === 422){
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
                email: registeredEmail,
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
            const response = await fetch(BASE_URL.online + "/resend-otp", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: registeredEmail,
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


    return (
        <SafeAreaView style={styles.container}>
            <StatusBar style="dark" />

            {loading && < FullScreenLoader text={`Submitting data, please wait...`} />}

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
                                <RemixIcon style={styles.backIcon} name={`arrow-left-long-line`} size={22} color="#595959"/>
                            </TouchableOpacity>


                            {step === "register" && (
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
                                            Sign Up
                                        </Text>
                                        <Text style={[TEXT.Body, { textAlign: "center" }]}>
                                            Join us today! Fill in your details to get started.
                                        </Text>
                                    </View>

                                    <View style={styles.inputForm}>
                                        <View>
                                            {errorMessages.name && (
                                                <Text style={styles.errorText}>
                                                    {errorMessages.name[0]}
                                                </Text>
                                            )}
                                            <DLMInput
                                                icon="user-4-fill"
                                                placeholder="Enter your full name"
                                                keyboardType="text"
                                                maxLength={150}
                                                value={name}
                                                onChangeText={(text) => {
                                                    setName(text);
                                                    setErrorMessages(prev => ({
                                                        ...prev,
                                                        name: null
                                                    }));
                                                }}
                                                error={!!errorMessages.name}
                                            />
                                        </View>

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

                                        <View>
                                            {errorMessages.phone && (
                                                <Text style={styles.errorText}>
                                                    {errorMessages.phone[0]}
                                                </Text>
                                            )}
                                            <DLMInput
                                                icon="phone-fill"
                                                placeholder="Enter your phone"
                                                keyboardType="number-pad"
                                                maxLength={15}
                                                value={phone}
                                                onChangeText={(text) => {
                                                    setPhone(text);
                                                    setErrorMessages(prev => ({
                                                        ...prev,
                                                        phone: null
                                                    }));
                                                }}
                                                error={!!errorMessages.phone}
                                            />
                                        </View>

                                        <View>
                                            {errorMessages.password && (
                                                <Text style={styles.errorText}>
                                                    {errorMessages.password[0]}
                                                </Text>
                                            )}
                                            <DLMInput
                                                icon="lock-2-fill"
                                                placeholder="Enter your password"
                                                secure={true}
                                                keyboardType="password"
                                                maxLength={100}
                                                value={password}
                                                onChangeText={(text) => {
                                                    setPassword(text);
                                                    setErrorMessages(prev => ({
                                                        ...prev,
                                                        password: null
                                                    }));
                                                }}
                                                error={!!errorMessages.password}
                                            />

                                        </View>
                                        <View>
                                            <DLMButton
                                                title="SIGN IN"
                                                variant="solid"
                                                loading={loading}
                                                disabled={loading}
                                                onPress={submitRegister}
                                            />
                                        </View>
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
                        </View>

                        {/* FOOTER */}
                        <View style={styles.footer}>
                            <Copyright />
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
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
        width: moderateScale(80),
        height: moderateScale(80),
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

    inputForm: {
        gap: moderateScale(20),
        width: "100%",
    },

    errorText: {
        fontSize: moderateScale(12),
        textAlign: "right",
        marginBottom: verticalScale(5),
        color: "#e5383b"
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
        marginTop: verticalScale(40),
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