import {
    Text,
    View,
    StyleSheet,
    Platform,
    KeyboardAvoidingView,
    ScrollView, Button, TouchableOpacity, Image,
} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";
import Copyright from "../../components/common/copyright";
import {useAuthStore} from "../../utils/useAuthStore";
import React, {useState} from "react";
import {StatusBar} from "expo-status-bar";
import {COLOR, TEXT} from "../../utils/theme";
import {moderateScale, verticalScale, normalize,} from "../../utils/scale";
import RemixIcon from "react-native-remix-icon";
import {useToast} from "../../components/common/ToastProvider";
import FullScreenLoader from "../../components/common/fullScreenLoader";
import Header from "../../components/common/Header";
import { Skeleton } from "moti/skeleton";

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export default function Profile() {
    const {logOut, resetOnboarding} = useAuthStore();
    const userData = useAuthStore((state) => state.user)
    const [loadingLogout, setLoadingLogout] = useState(false);
    const { showToast } = useToast();

    const [profileImage, setProfileImage] = useState(
        "https://i.pravatar.cc/300"
    );

    const menuItems = [
        { name: "Your profile", icon: "user-3-line" },
        { name: "Payment methods", icon: "bank-card-line" },
        { name: "My Wallet", icon: "wallet-3-line" },
        { name: "Settings", icon: "settings-3-line" },
        { name: "Help center", icon: "question-line" },
        { name: "Privacy policy", icon: "lock-line" },
        { name: "Invite friends", icon: "user-add-line" },
    ];

    const submitLogout = async () => {
        setLoadingLogout(true);
        await delay(2000);

        try {
            // call API here
            const status = 200;

            if (status === 200) {
                showToast({
                    type: "success",
                    message: "Logout successful.",
                });
                logOut();
            }
        } catch (err) {
            console.log(err);
        } finally {
            setLoadingLogout(false);
        }
    };


    return (
        <SafeAreaView style={styles.container}>
            <StatusBar style="dark" />
            <Header icon={`user-3-fill`} title={`Profile`}/>

            {loadingLogout && (
                <FullScreenLoader text="Logging out from account, please wait..." />
            )}
            <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ flexGrow: 1 }}
                    keyboardShouldPersistTaps="handled">
                        <View style={styles.wrapper}>
                            {/* HEADER PROFILE */}
                            <View style={styles.header}>
                                <View style={styles.imageWrapper}>
                                    <Image source={{ uri: profileImage }} style={styles.image} />

                                    <TouchableOpacity style={styles.editBtn}>
                                        <RemixIcon name="camera-line" size={18} color="#fff" />
                                    </TouchableOpacity>
                                </View>

                                <View>
                                    <Text style={styles.name}>{userData?.user?.name}</Text>
                                    <Text style={styles.email}>{userData?.user?.email}</Text>
                                </View>
                            </View>


                            <View style={styles.profileInfo}>
                                <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
                                    <Image
                                        source={require('../../../assets/icons/ghana-flag.png')}
                                        style={styles.flagImage}
                                        resizeMode="contain"
                                    />
                                    <Text style={TEXT.Caption}>Ghana</Text>
                                </View>

                                <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
                                    <RemixIcon name="stairs-fill" size={22} color="#333" />
                                    <Text style={TEXT.Caption}>Level one</Text>
                                </View>

                                <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
                                    <RemixIcon name="gradienter-fill" size={22} color="#333" />
                                    <Text style={TEXT.Caption}>1289 point</Text>
                                </View>
                            </View>

                            {/* MENU LIST */}
                            <View style={styles.card}>
                                {menuItems.map((item, index) => (
                                    <TouchableOpacity key={index} style={styles.item}>
                                        <View style={styles.itemLeft}>
                                            <RemixIcon name={item.icon} size={22} color="#333" />
                                            <Text style={styles.itemText}>{item.name}</Text>
                                        </View>

                                        <RemixIcon name="arrow-right-s-line" size={22} color="#999" />
                                    </TouchableOpacity>
                                ))}
                            </View>

                            {/* LOGOUT */}
                            <TouchableOpacity onPress={submitLogout} style={styles.logout}>
                                <RemixIcon name="logout-box-line" size={20} color="red" />
                                <Text style={styles.logoutText}>Log out</Text>
                            </TouchableOpacity>


                            <Button title={`Reset Onboarding`} onPress={resetOnboarding}/>

                            <Copyright/>
                        </View>
                </ScrollView>
            </KeyboardAvoidingView>

        </SafeAreaView>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLOR.background,
    },
    wrapper: {
        flex: 1,
        paddingHorizontal: verticalScale(15),
    },

    header: {
        paddingTop: verticalScale(10),
        paddingBottom: verticalScale(10),
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
    },

    imageWrapper: {
        position: "relative",
    },

    image: {
        width: normalize(80),
        height: normalize(80),
        borderRadius: 100,
        borderWidth: 1,
        borderColor: COLOR.textLight,
    },
    editBtn: {
        position: "absolute",
        bottom: 0,
        right: 0,
        backgroundColor: COLOR.primary,
        width: 30,
        height: 30,
        borderRadius: 14,
        justifyContent: "center",
        alignItems: "center",
    },

    name: {
        fontSize: 18,
        fontFamily: "PoppinsExtraBold",
    },

    email: {
        ...TEXT.Caption,
        color: "#777",
        marginTop: 2,
    },

    profileInfo: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 10,
        backgroundColor: "rgba(0,90,212,0.06)",
        borderWidth: 1,
        borderColor: "rgba(0,90,212,0.16)",
        paddingHorizontal: 10,
        paddingVertical: 15,
        borderRadius: 10,
    },
    flagImage: {
        width: 25,
        height: 15,
    },

    card: {
        backgroundColor: "#fff",
        borderRadius: normalize(10),
        paddingVertical: normalize(10),
        paddingHorizontal: verticalScale(15),
        elevation: 2,
    },

    item: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: verticalScale(18),
        borderBottomWidth: 1,
        borderBottomColor: "#eee",
    },

    itemLeft: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
    },
    itemText: {
        ...TEXT.Body,
    },

    logout: {
        marginTop: 20,
        marginBottom: verticalScale(40),
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 10,
        paddingVertical: 14,
        borderRadius: verticalScale(10),
        backgroundColor: "#ffe5e5",
    },

    logoutText: {
        color: "red",
        ...TEXT.Body,
    },
})