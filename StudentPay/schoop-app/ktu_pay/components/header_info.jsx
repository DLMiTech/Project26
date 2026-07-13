import React from 'react';
import {View, StyleSheet, Text} from "react-native";
import {Ionicons} from "@expo/vector-icons";
import {COLORS, SIZES} from "../constants/init";

const HeaderInfo = ({icon, name}) => {
    return (
        <View style={styles.container}>
            <View style={styles.icon_box}>
                <Ionicons name={icon} style={styles.icon}></Ionicons>
            </View>
            <Text style={styles.name}>{name}</Text>
        </View>
    );
};

export default HeaderInfo;
const styles = StyleSheet.create({
    container: {
        display: "flex",
        flexDirection: "row",
        marginTop: 15,
        paddingVertical: 3,
        borderColor: COLORS.gray,
        alignItems: 'center',
        gap: 10,
    },
    icon_box: {
        width: 30,
        height: 30,
        borderRadius: '50%',
        backgroundColor: COLORS.white,
        borderWidth: 1,
        borderColor: COLORS.gray,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    icon: {
        fontSize: 18,
        color: COLORS.gray
    },
    name: {
        fontSize: SIZES.medium,
        color: COLORS.gray,
        fontFamily: 'extraBold'
    }
})