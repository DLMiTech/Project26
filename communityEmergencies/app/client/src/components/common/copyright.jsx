import React from 'react';
import { Text, View, StyleSheet } from "react-native";

const Copyright = () => {
    const currentYear = new Date().getFullYear();

    return (
        <View style={styles.container}>
            <Text style={styles.text}>
                © {currentYear} SchoolPal. All rights reserved.
            </Text>
        </View>
    );
};

export default Copyright;

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        paddingVertical: 10,
    },
    text: {
        fontSize: 12,
        color: "#666",
        fontFamily: "PoppinsExtraLightItalic",
    }
});
