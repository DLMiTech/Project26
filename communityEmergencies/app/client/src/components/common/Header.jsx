import React from 'react';
import TopHeaderText from "./TopHeaderText";
import {View, StyleSheet, Text, TouchableOpacity} from "react-native";
import {COLOR} from "../../utils/theme";
import {router} from "expo-router";
import RemixIcon from "react-native-remix-icon";

const Header = ({icon, title}) => {
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TopHeaderText icon={icon} label={title}/>
            </View>

            <TouchableOpacity style={styles.notification} onPress={() => router.push("/modals/notification")}>
                <View>
                    <RemixIcon
                        name={'notification-4-line'}
                        size={20}
                        color={'#000'}
                    />
                </View>
                <Text style={styles.notificationNumber}>2</Text>
            </TouchableOpacity>
        </View>
    );
};

export default Header;

const styles = StyleSheet.create({
    container: {
        backgroundColor: COLOR.background,
        paddingBottom: 10,
        paddingHorizontal: 15,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    notification: {
        width: 35,
        height: 35,
        borderRadius: 100,
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 1,
        borderColor: COLOR.textLight,
    },
    notificationNumber: {
        position: "absolute",
        top: -5,
        right: -5,
        backgroundColor: "#ff0000",
        color: COLOR.white,
        width: 18,
        height: 18,
        borderRadius: 100,
        textAlign: "center",
        fontSize: 10,
        lineHeight: 18,
    }
})