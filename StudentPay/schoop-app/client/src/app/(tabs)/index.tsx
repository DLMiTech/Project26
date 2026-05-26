import React from 'react';
import {
    View,
    Text,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet, TouchableOpacity,
} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";
import {StatusBar} from "expo-status-bar";
import {COLOR, TEXT} from "@/src/utils/theme";
import {verticalScale} from "@/src/utils/scale";

const Index = () => {


    return (
        <SafeAreaView style={styles.container}>
            <StatusBar style="dark" />

            <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ flexGrow: 1 }}
                    keyboardShouldPersistTaps="handled"
                >


                </ScrollView>
            </KeyboardAvoidingView>

        </SafeAreaView>
    );
};

export default Index;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLOR.background,
    },
    wrapper: {
        flex: 1,
        paddingHorizontal: verticalScale(15),
        backgroundColor: COLOR.background,
    },
})