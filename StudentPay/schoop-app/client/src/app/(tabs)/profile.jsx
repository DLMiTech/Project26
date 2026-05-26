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


const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export default function Profile() {
    const {logOut, resetOnboarding} = useAuthStore();
    const userData = useAuthStore((state) => state.user)
    const [loadingLogout, setLoadingLogout] = useState(false);
    const { showToast } = useToast();

    const [profileImage, setProfileImage] = useState(
        "https://i.pravatar.cc/300"
    );

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


                            {/* LOGOUT */}
                            <TouchableOpacity onPress={submitLogout}>
                                <RemixIcon name="logout-box-line" size={20} color="red" />
                                <Text>Log out</Text>
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

})