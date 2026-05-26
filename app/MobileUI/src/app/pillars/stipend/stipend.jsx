import React from 'react';
import {KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View} from "react-native";
import {StatusBar} from "expo-status-bar";
import BackButton from "../../../components/common/BackButton";
import {SafeAreaView} from "react-native-safe-area-context";
import {COLOR} from "../../../utils/theme";
import {verticalScale} from "../../../utils/scale";

const Stipend = () => {
    return (
        <SafeAreaView style={styles.container}>
            <StatusBar style="dark" />
            <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ flexGrow: 1 }}
                    keyboardShouldPersistTaps="handled"
                >
                    <View style={styles.wrapper}>
                        <BackButton/>
                        <Text>Stipend Ghana</Text>
                    </View>

                </ScrollView>
            </KeyboardAvoidingView>

        </SafeAreaView>
    );
};

export default Stipend;

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