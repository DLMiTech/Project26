import {
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Text,
    View,
    StyleSheet, TouchableOpacity,
} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";
import React, {useState} from "react";
import Copyright from "../../components/common/copyright";
import {COLOR, TEXT} from "../../utils/theme";
import {moderateScale, verticalScale, normalize,} from "../../utils/scale";
import {StatusBar} from "expo-status-bar";
import WalletCard from "../../components/wallet/WalletCard";
import TransactionList from "../../components/wallet/TransactionList";
import WalletActions from "../../components/wallet/WalletActions";
import {router} from "expo-router";
import RemixIcon from "react-native-remix-icon";
import Header from "../../components/common/Header";


export default function Report() {

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar style="dark" />
            <Header icon={`wallet-fill`} title={`Report`}/>
            <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ flexGrow: 1 }}
                    keyboardShouldPersistTaps="handled">

                    <View style={styles.wrapper}>



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
    allButton: {
        flex: 1,
        backgroundColor: COLOR.white,
        paddingVertical: verticalScale(12),
        borderRadius: moderateScale(5),
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "row",
        gap: 10,
        borderWidth: 1,
        borderColor: COLOR.textLight,
        marginBottom: 50
    }

})