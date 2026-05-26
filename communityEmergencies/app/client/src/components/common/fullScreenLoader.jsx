import React, {useEffect, useRef} from "react";
import {View, ActivityIndicator, StyleSheet, Text, Image} from "react-native";
import { BlurView } from "expo-blur";
import {moderateScale} from "../../utils/scale";
import { Animated, Easing } from "react-native";


export default function FullScreenLoader({text}) {
    const scaleAnim = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(scaleAnim, {
                    toValue: 1.2,
                    duration: 800,
                    easing: Easing.inOut(Easing.ease),
                    useNativeDriver: true,
                }),
                Animated.timing(scaleAnim, {
                    toValue: 1,
                    duration: 800,
                    easing: Easing.inOut(Easing.ease),
                    useNativeDriver: true,
                }),
            ])
        ).start();
    }, []);
    return (
        <BlurView intensity={60} tint="dark" style={styles.overlay}>
            <View style={styles.wrapper}>
                <Animated.Image
                    source={require('../../../assets/logo/logo-wb.png')}
                    style={[
                        styles.image,
                        { transform: [{ scale: scaleAnim }] }
                    ]}
                    resizeMode="contain"
                />
                <Text style={styles.loadingText}>LOADING</Text>
                <Text style={styles.text}>{text}</Text>
                <ActivityIndicator size="large" color="#ffffff" />
            </View>
        </BlurView>
    );
}

const styles = StyleSheet.create({
    overlay: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: "center",
        alignItems: "center",
        zIndex: 9999,
    },
    wrapper: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 10,
        // width: "90%",
        // borderRadius: 10,
        // paddingHorizontal: 15,
        // paddingVertical: 30,
        //backgroundColor: "#ffffff",
        //backgroundColor: "rgba(255,255,255,0.15)",
    },
    image: {
        width: moderateScale(80),
        height: moderateScale(80),
        marginBottom: moderateScale(20),
    },
    loadingText: {
        fontSize: moderateScale(18),
        fontFamily: "BarlowRegular",
        fontWeight: "800",
        color: "#ffffff",
    },
    text: {
        fontSize: moderateScale(18),
        fontFamily: "BarlowRegular",
        fontWeight: "400",
        textAlign: "center",
        color: "#ffffff",
    }
});
