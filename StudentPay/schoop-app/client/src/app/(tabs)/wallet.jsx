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


export default function Wallet() {

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar style="dark" />

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


})