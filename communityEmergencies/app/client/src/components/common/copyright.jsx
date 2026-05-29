import React from 'react';
import { Text, View, StyleSheet } from "react-native";
import {COLOR} from "../../utils/theme";

const Copyright = () => {
    const currentYear = new Date().getFullYear();

    return (
        <View style={styles.container}>
            <Text style={styles.text}>
                © {currentYear} EMERGENCY. Powered by DLMiTech.
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
        fontSize: 14,
        color: COLOR.textDark,
        fontFamily: "PoppinsExtraLightItalic",
    }
});
