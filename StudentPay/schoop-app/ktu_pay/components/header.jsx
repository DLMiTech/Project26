import React from 'react';
import {View, StyleSheet, Text, Image, TouchableOpacity} from "react-native";
import {COLORS, SIZES} from "../constants/init";
import {Ionicons} from "@expo/vector-icons";
import {router} from "expo-router";

const Header = () => {
    return (
        <View style={styles.header}>
            <View style={styles.header_info}>
                <Image
                    source={require('../assets/images/profile.jpg')}
                    style={styles.profile_image}
                    resizeMode="contain"
                />
                <View style={styles.user_info}>
                    <Text style={styles.username}>Lukeman Dramani</Text>
                    <Text style={styles.program}>Computer Science</Text>
                </View>
            </View>

            <TouchableOpacity onPress={() => router.replace('login')} style={styles.logoutBtn}>
                <Ionicons name="log-out" style={styles.logoutIcon}></Ionicons>
            </TouchableOpacity>
        </View>
    );
};

export default Header;
const styles = StyleSheet.create({
    header: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
    },
    header_info: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
    },
    profile_image: {
        width: 45,
        height: 45,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: COLORS.gray,
    },
    user_info: {
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
    },
    username: {
        fontSize: SIZES.medium,
        fontWeight: "700",
    },
    program: {
        fontSize: SIZES.xSmall,
        borderWidth: 1,
        borderRadius: 3,
        backgroundColor: COLORS.primary,
        color: COLORS.white,
        width: "fit-content",
        paddingHorizontal: 5,
    },
    logoutBtn: {
        width: 30,
        height: 30,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: COLORS.gray,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    },
    logoutIcon: {
        fontSize: 20
    },
})