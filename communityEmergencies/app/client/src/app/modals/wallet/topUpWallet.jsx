import React from 'react';
import {KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View} from "react-native";
import TransparentModalWarper from "../transparentModalWarper";
import ModelHeader from "../../../components/common/ModelHeader";
import {verticalScale} from "../../../utils/scale";

const TopUpWallet = () => {
    return (
        <TransparentModalWarper>
            <ModelHeader icon={"wallet-fill"} title={"Top Up Report"}/>
            <View style={styles.wrapper}>
                <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ flexGrow: 1 }}
                        keyboardShouldPersistTaps="handled">
                        <View>
                            <Text>Top up wallet</Text>
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
            </View>
        </TransparentModalWarper>
    );
};

export default TopUpWallet;

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        paddingVertical: verticalScale(15),
        paddingHorizontal: verticalScale(15),
    },
});