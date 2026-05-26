import React, {useEffect, useRef} from 'react';
import {ActivityIndicator, Animated, Easing, StyleSheet, Text, View} from "react-native";
import {moderateScale} from "../../utils/scale";
import {TEXT} from "../../utils/theme";

const DataLoader = ({text}) => {
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
        <View style={styles.wrapper}>
            <Animated.Image
                source={require('../../../assets/logo/logo-wb.png')}
                style={[
                    styles.image,
                    { transform: [{ scale: scaleAnim }] }
                ]}
                resizeMode="contain"
            />
            <Text style={styles.text}>{text}</Text>
            <ActivityIndicator size="large" color="#000000" />
        </View>
    );
};

export default DataLoader;

const styles = StyleSheet.create({
    wrapper: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 10,
        marginTop: moderateScale(20),
    },
    image: {
        width: moderateScale(50),
        height: moderateScale(50),
        marginBottom: moderateScale(20),
    },
    text: {
        ...TEXT.Body,
    }
});