import React, {useState} from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {router} from "expo-router";
import RemixIcon from "react-native-remix-icon";
import {COLOR} from "../../utils/theme";
import {normalize} from "../../utils/scale";
import {useAuthStore} from "../../utils/useAuthStore";

const MainHeader = () => {
    const userData = useAuthStore((state)=> state.user)

    const [profileImage, setProfileImage] = useState(
        "https://i.pravatar.cc/300"
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Image source={{ uri: profileImage }} style={styles.image} />
                <View>
                    <Text style={styles.name}>{userData?.user?.username}</Text>
                    <Text style={styles.date}>Role: {userData?.user?.role} </Text>
                </View>
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

export default MainHeader;

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
    },
    image: {
        width: normalize(40),
        height: normalize(40),
        borderRadius: 100,
        borderWidth: 1,
        borderColor: COLOR.textLight,
    },
    name: {
        fontFamily: "PoppinsExtraBold",
        fontSize: 12,
    },
    date: {
        fontFamily: "PoppinsLight",
        fontSize: 10,
        color: COLOR.textLight,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
    },
})