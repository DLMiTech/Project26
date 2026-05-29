import React, {
    useEffect,
    useRef,
    useState,
    forwardRef,
    useImperativeHandle
} from "react";

import {
    TextInput,
    View,
    StyleSheet
} from "react-native";

import RemixIcon from "react-native-remix-icon";

const DLMOTPInput = forwardRef(({ length = 4, onComplete }, ref) => {

    const [otp, setOtp] = useState(Array(length).fill(""));
    const inputs = useRef([]);

    useImperativeHandle(ref, () => ({
        clear: () => {
            setOtp(Array(length).fill(""));

            setTimeout(() => {
                inputs.current[0]?.focus();
            }, 100);
        }
    }));

    useEffect(() => {
        if (otp.every((digit) => digit !== "")) {
            onComplete && onComplete(otp.join(""));
        }
    }, [otp]);

    const handleChange = (text, index) => {

        if (/^\d?$/.test(text)) {

            const updatedOtp = [...otp];
            updatedOtp[index] = text;

            setOtp(updatedOtp);

            if (text && index < length - 1) {
                inputs.current[index + 1]?.focus();
            }
        }
    };

    const handleKeyPress = (e, index) => {

        if (
            e.nativeEvent.key === "Backspace" &&
            otp[index] === "" &&
            index > 0
        ) {
            inputs.current[index - 1]?.focus();
        }
    };

    return (
        <View style={styles.otpContainer}>
            {otp.map((digit, index) => (
                <View key={index} style={styles.otpWrapper}>

                    {digit === "" && (
                        <RemixIcon
                            name="lock-password-fill"
                            size={20}
                            color="#666"
                            style={styles.iconPlaceholder}
                        />
                    )}

                    <TextInput
                        ref={(ref) => (inputs.current[index] = ref)}
                        keyboardType="number-pad"
                        maxLength={1}
                        value={digit}
                        onChangeText={(text) => handleChange(text, index)}
                        onKeyPress={(e) => handleKeyPress(e, index)}
                        style={styles.otpInput}
                        autoFocus={index === 0}
                    />

                </View>
            ))}
        </View>
    );
});

export default DLMOTPInput;

const styles = StyleSheet.create({
    otpContainer: {
        flexDirection: "row",
        justifyContent: "center",
        gap: 15,
    },

    otpWrapper: {
        position: "relative",
    },

    otpInput: {
        width: 60,
        height: 60,
        textAlign: "center",
        borderRadius: 5,
        borderWidth: 1,
        borderColor: "#9e9fa8",
        fontSize: 20,
        fontWeight: "bold",
    },

    iconPlaceholder: {
        position: "absolute",
        alignSelf: "center",
        top: 20,
    },
});