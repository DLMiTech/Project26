import React, { useState, useEffect } from "react";
import {Text, View, StyleSheet, Image, TouchableOpacity} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useAuthStore } from "../../utils/useAuthStore";
import { COLOR, DIMENSIONS } from "../../utils/theme";
import DlmRouteButton from "../../components/common/DLMRouteButton";
import Animated, { useSharedValue, withTiming, useAnimatedStyle} from "react-native-reanimated";
import {moderateScale, verticalScale, normalize,} from "../../utils/scale";
import RemixIcon from "react-native-remix-icon";

const ONBOARDING_DATA = [
    {
        title: "Fees Payment",
        description:
            "Pay your school fees securely anytime and complete transactions in just a few steps.",
        image: require("../../../assets/images/onboard/01.png"),
    },
    {
        title: "Instant Update",
        description:
            "Receive real-time notifications and payment status updates immediately after every transaction.",
        image: require("../../../assets/images/onboard/02.png"),
    },
    {
        title: "Get Invoice",
        description:
            "View, download, and manage your payment invoices and receipts whenever you need them.",
        image: require("../../../assets/images/onboard/03.png"),
    },
];

export default function OnboardingScreen() {
    const { completeOnboarding } = useAuthStore();
    const [currentIndex, setCurrentIndex] = useState(0);

    const isLast = currentIndex === ONBOARDING_DATA.length - 1;
    const isFirst = currentIndex === 0;


    const handleNext = () => {
        if (isLast) {
            completeOnboarding();
        } else {
            setCurrentIndex(currentIndex + 1);
        }
    };

    const handleBack = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
        }
    };

    // Shared values for animation
    const opacity = useSharedValue(0);
    const translateY = useSharedValue(30);

    // Animate whenever the currentIndex changes
    useEffect(() => {
        opacity.value = 0;
        translateY.value = 30;

        opacity.value = withTiming(1, { duration: 1000 });
        translateY.value = withTiming(0, { duration: 800 });
    }, [currentIndex]);

    const animatedStyle = useAnimatedStyle(() => ({
        opacity: opacity.value,
        transform: [{ translateY: translateY.value }],
    }));


    const current = ONBOARDING_DATA[currentIndex];

    return (
        <View style={styles.container}>
            <StatusBar style="light" />

            {/* TOP */}
            <View style={styles.top}>
                <TouchableOpacity onPress={completeOnboarding} style={styles.button}>
                    <RemixIcon
                        name={"skip-forward-line"}
                        size={22}
                        color={"#fff"}
                    />
                    <Text style={styles.buttonText}>Skip</Text>
                </TouchableOpacity>
            </View>

            {/* IMAGE */}
            <Animated.View style={[styles.middle, animatedStyle]}>
                <Image source={current.image} style={styles.image} resizeMode="contain" />
            </Animated.View>

            {/* BOTTOM */}
            <Animated.View style={[styles.bottom, animatedStyle]}>

                {/* TEXT */}
                <View style={styles.onboardingInfo}>
                    <Text style={styles.title}>{current.title}</Text>
                    <Text style={styles.description}>{current.description}</Text>
                </View>

                {/* DOTS */}
                <View style={styles.dotsContainer}>
                    {ONBOARDING_DATA.map((_, index) => (
                        <View
                            key={index}
                            style={[
                                styles.dot,
                                index === currentIndex && styles.activeDot,
                            ]}
                        />
                    ))}
                </View>

                {/* BUTTONS */}
                <View
                    style={[
                        styles.buttonContainer,
                        {
                            justifyContent: isFirst
                                ? "flex-end"
                                : "space-between",
                        },
                    ]}
                >
                    {!isFirst && (
                        <TouchableOpacity onPress={handleBack} style={styles.button}>
                            <RemixIcon name={"skip-left-line"} size={22} color={"#fff"}/>
                            <Text style={styles.buttonText}>Back</Text>
                        </TouchableOpacity>
                    )}

                    <TouchableOpacity onPress={handleNext} style={styles.button}>
                        <RemixIcon name={isLast ? "skip-forward-line" : "skip-right-line"} size={22} color={"#fff"}/>
                        <Text style={styles.buttonText}>{isLast ? "Skip" : "Next"}</Text>
                    </TouchableOpacity>
                </View>

            </Animated.View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLOR.primary,
        padding: moderateScale(20),
    },

    // TOP
    top: {
        flexDirection: "row",
        justifyContent: "flex-end",
        marginTop: moderateScale(20),
    },

    // MIDDLE
    middle: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },

    image: {
        width: DIMENSIONS.width * 0.75,
        height: DIMENSIONS.height * 0.35,
    },

    // BOTTOM
    bottom: {
        alignItems: "center",
        gap: moderateScale(20),
    },

    button: {
        flexDirection: "row",
        gap: moderateScale(10),
        alignItems: "center",
        borderWidth: 1,
        paddingHorizontal: moderateScale(8),
        paddingVertical: moderateScale(5),
        borderRadius: moderateScale(5),
        borderColor: COLOR.white,
    },
    buttonText: {
        color: COLOR.white,
    },

    onboardingInfo: {
        alignItems: "center",
        paddingHorizontal: verticalScale(20),
    },

    title: {
        fontSize: normalize(26),
        fontFamily: "PoppinsBold",
        marginBottom: verticalScale(10),
        textAlign: "center",
        color: COLOR.secondary,
    },

    description: {
        fontSize: normalize(18),
        fontFamily: "PoppinsRegular",
        textAlign: "center",
        color: COLOR.white,
    },

    dotsContainer: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
    },

    dot: {
        width: moderateScale(15),
        height: moderateScale(15),
        borderRadius: moderateScale(8),
        backgroundColor: "#ccc",
        marginHorizontal: moderateScale(5),
    },

    activeDot: {
        width: moderateScale(20),
        height: moderateScale(20),
        backgroundColor: COLOR.secondary,
    },

    buttonContainer: {
        marginTop: verticalScale(15),
        marginBottom: verticalScale(10),
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        width: "100%",
    },
});