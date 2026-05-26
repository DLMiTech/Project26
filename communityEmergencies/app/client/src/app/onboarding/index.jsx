import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, Image } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useAuthStore } from "../../utils/useAuthStore";
import { COLOR, DIMENSIONS } from "../../utils/theme";
import DlmRouteButton from "../../components/common/DLMRouteButton";
import Animated, { useSharedValue, withTiming, useAnimatedStyle} from "react-native-reanimated";
import {moderateScale, verticalScale, normalize,} from "../../utils/scale";

const ONBOARDING_DATA = [
    {
        title: "Stipend Ghana",
        description:
            "Manage your student funds, set budgets, receive support, and make secure payments easily.",
        image: require("../../../assets/images/onboard/onboarding-one.png"),
    },
    {
        title: "Forms Ghana",
        description:
            "Buy admission forms, track payments, and access institutions directly from one platform.",
        image: require("../../../assets/images/onboard/onboarding-four.png"),
    },
    {
        title: "Hostels Ghana",
        description:
            "Find affordable hostels, compare prices, book beds, and explore locations near your school.",
        image: require("../../../assets/images/onboard/onboarding-two.png"),
    },
    {
        title: "Internships Ghana",
        description:
            "Discover internships, connect with HR, and track your performance while building experience.",
        image: require("../../../assets/images/onboard/onboarding-three.png"),
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
            <StatusBar style="dark" />

            {/* TOP */}
            <View style={styles.top}>
                <DlmRouteButton
                    icon="skip-forward-line"
                    type="custom"
                    onPress={completeOnboarding}
                    variant="primary"
                    color={COLOR.primary}
                />
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
                        <DlmRouteButton
                            icon="arrow-left-line"
                            type="custom"
                            onPress={handleBack}
                            variant="primary"
                            color={COLOR.primary}
                        />
                    )}

                    <DlmRouteButton
                        icon={isLast ? "check-line" : "arrow-right-line"}
                        type="custom"
                        onPress={handleNext}
                        variant="primary"
                        color={COLOR.primary}
                    />
                </View>

            </Animated.View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLOR.white,
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

    onboardingInfo: {
        alignItems: "center",
        paddingHorizontal: verticalScale(20),
    },

    title: {
        fontSize: normalize(26),
        fontFamily: "PoppinsBold",
        marginBottom: verticalScale(10),
        textAlign: "center",
    },

    description: {
        fontSize: normalize(18),
        fontFamily: "PoppinsRegular",
        textAlign: "center",
        color: "#666",
    },

    dotsContainer: {
        flexDirection: "row",
        justifyContent: "center",
    },

    dot: {
        width: moderateScale(12),
        height: moderateScale(12),
        borderRadius: moderateScale(6),
        backgroundColor: "#ccc",
        marginHorizontal: moderateScale(5),
    },

    activeDot: {
        width: moderateScale(25),
        backgroundColor: COLOR.primary,
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