import React from 'react';
import {
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import Header from "../../components/header";
import HeaderInfo from "../../components/header_info";
import {COLORS, SIZES} from "../../constants/init";
import {Ionicons} from "@expo/vector-icons";

const Payment = () => {
    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView style={styles.wrapper}
                                  behavior={Platform.OS === "ios" ? "padding" : "height"}>
                <Header/>
                <HeaderInfo icon={`wallet`} name={`PAYMENT`}/>
                <ScrollView contentContainerStyle={{ flexGrow: 1}}
                            keyboardShouldPersistTaps="handled">
                    <View style={styles.payment_wrapper}>
                        <TouchableOpacity style={styles.payment_type}>
                            <View style={styles.payment_icon}>
                                <Ionicons name="wallet" style={styles.icon}></Ionicons>
                            </View>
                            <Text style={styles.text}>SCHOOL FEES</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.payment_type}>
                            <View style={styles.payment_icon}>
                                <Ionicons name="create" style={styles.icon}></Ionicons>
                            </View>
                            <Text style={styles.text}>RESIT EXAMS</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.payment_type}>
                            <View style={styles.payment_icon}>
                                <Ionicons name="reader" style={styles.icon}></Ionicons>
                            </View>
                            <Text style={styles.text}>TRANSCRIPT</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.payment_type}>
                            <View style={styles.payment_icon}>
                                <Ionicons name="star-half" style={styles.icon}></Ionicons>
                            </View>
                            <Text style={styles.text}>ATTESTATION</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.payment_type}>
                            <View style={styles.payment_icon}>
                                <Ionicons name="id-card" style={styles.icon}></Ionicons>
                            </View>
                            <Text style={styles.text}>ID CARD REPLACEMENT</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.payment_type}>
                            <View style={styles.payment_icon}>
                                <Ionicons name="flask" style={styles.icon}></Ionicons>
                            </View>
                            <Text style={styles.text}>MEDICALS</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

export default Payment;
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    wrapper: {
        flex: 1,
        paddingHorizontal: 20,
    },
    payment_wrapper: {
        marginTop: 20,
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        flexWrap: "wrap",
    },
    payment_type: {
        padding: 10,
        width: "100%",
        backgroundColor: COLORS.white,
        borderWidth: 0.5,
        borderRadius: 5,
        borderLeftWidth: 5,
        borderColor: COLORS.primary,
        marginBottom: 15,
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-start",
        gap: 10,
    },
    payment_icon: {
        width: 40,
        height: 40,
        borderRadius: '50%',
        borderWidth: 1,
        borderColor: COLORS.lightGray,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    },
    icon: {
        fontSize: 18,
        color: COLORS.secondary,
    },
    text: {
        fontSize: SIZES.medium,
        fontWeight: "bold",
        color: COLORS.gray,
    }
})