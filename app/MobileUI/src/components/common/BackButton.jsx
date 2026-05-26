import React from 'react';
import {router} from "expo-router";
import RemixIcon from "react-native-remix-icon";
import {TouchableOpacity, StyleSheet} from "react-native";
import {verticalScale} from "../../utils/scale";
import {COLOR} from "../../utils/theme";

const BackButton = () => {
    return (
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
    );
};

export default BackButton;

const styles = StyleSheet.create({
    backButton: {
        position: "absolute",
        left: verticalScale(10),
        zIndex: 10,
        padding: 10,
        borderWidth: 1,
        borderRadius: 100,
        borderColor: COLOR.textLight,
    }
})