import React, {useState} from 'react';
import {
    Image,
    KeyboardAvoidingView, Platform,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";
import Header from "../../components/header";
import HeaderInfo from "../../components/header_info";
import {COLORS, SIZES} from "../../constants/init";
import * as navigation from "expo-router/build/global-state/routing";

const Profile = () => {
    const [oPassword, setOPassword] = useState("");
    const [password, setPassword] = useState("");
    const [cPassword, setCPassword] = useState("");

    const handleChangePassword = () => {
        alert(password+" "+cPassword);
    };
    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView style={styles.wrapper}
                                  behavior={Platform.OS === "ios" ? "padding" : "height"}>
                <Header/>
                <HeaderInfo icon={`person`} name={`PROFILE`}/>

                <ScrollView contentContainerStyle={{ flexGrow: 1}}
                            keyboardShouldPersistTaps="handled">
                    <View style={styles.profile_wrapper}>
                        <Image
                            source={require('../../assets/images/profile.jpg')}
                            style={styles.profile_image}
                            resizeMode="contain"
                        />
                        <View>
                            <Text style={styles.text}>Lukeman Dramani</Text>
                            <Text style={styles.text}>04/2020/1234D</Text>
                            <Text style={styles.text}>lukeman1234d@ktu.ed.gh</Text>
                            <Text style={styles.text}>022-2345-3456</Text>
                            <Text style={styles.text}>Computer Science</Text>
                        </View>
                    </View>

                    <HeaderInfo icon={`lock-closed`} name={`CHANGE PASSWORD`}/>

                    <View style={styles.login_form}>


                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Old password</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Enter old password"
                                secureTextEntry
                                value={oPassword}
                                onChangeText={setOPassword}
                            />
                        </View>


                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Password</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Enter password"
                                secureTextEntry
                                value={password}
                                onChangeText={setPassword}
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Confirm password</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Enter password"
                                secureTextEntry
                                value={cPassword}
                                onChangeText={setCPassword}
                            />
                        </View>

                        <TouchableOpacity style={{width:'100%'}} onPress={() => handleChangePassword()}>
                            <Text style={styles.startBtn}>Change Password</Text>
                        </TouchableOpacity>

                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

export default Profile;
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    wrapper: {
        flex: 1,
        paddingHorizontal: 20,
    },
    profile_image: {
        width: 80,
        height: 80,
        borderRadius: '50%',
        borderWidth: 1,
        borderColor: COLORS.gray,
    },
    profile_wrapper: {
        backgroundColor: COLORS.white,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: COLORS.gray,
        padding: 15,
        marginTop: 20,
        display: "flex",
        flexDirection: "row",
        gap: 10,
    },
    text: {
        fontSize: SIZES.medium,
        color: COLORS.offBlack,
        fontWeight: 'light',
        marginBottom: 10
    },

    login_form: {
        paddingHorizontal: 10,
        paddingVertical: 30,
        borderWidth: 1,
        borderRadius: 5,
        borderColor: COLORS.lightGray,
        backgroundColor: "#f9f9f9",
        marginTop: 20,
    },
    inputGroup: {
        marginBottom: 20,
    },
    label: {
        fontSize: SIZES.medium,
        color: COLORS.darkGray,
        marginBottom: 5,
    },
    input: {
        borderWidth: 1,
        borderColor: COLORS.lightGray,
        borderRadius: 8,
        padding: 12,
        fontSize: SIZES.medium,
        backgroundColor: COLORS.white,
    },
    startBtn: {
        backgroundColor: COLORS.primary,
        color: COLORS.white,
        paddingVertical: 12,
        paddingHorizontal: 40,
        borderRadius: 5,
        fontWeight: "bold",
        fontSize: 16,
        width: '100%',
        textAlign: "center",
    },
})