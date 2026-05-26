import React from "react";
import {View, Text, TouchableOpacity, StyleSheet, Button} from "react-native";
import {COLOR, TEXT} from "../../utils/theme";
import { verticalScale, moderateScale } from "../../utils/scale";
import RemixIcon from "react-native-remix-icon";
import {Link, router} from "expo-router";

export default function WalletActions() {
    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.button} onPress={() => router.push("/modals/wallet/topUpWallet")}>
                <View>
                    <RemixIcon
                        name={'add-box-line'}
                        size={20}
                        color={''}
                    />
                </View>
                <Text style={styles.buttonText}>Top Up</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button} onPress={() => router.push("/modals/wallet/transfer")}>
                <View>
                    <RemixIcon
                        name={'send-plane-2-line'}
                        size={20}
                        color={''}
                    />
                </View>
                <Text style={styles.buttonText}>Transfer</Text>
            </TouchableOpacity>

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: verticalScale(15),
        gap: moderateScale(10),
    },
    button: {
        flex: 1,
        backgroundColor: COLOR.white,
        paddingVertical: verticalScale(12),
        borderRadius: moderateScale(5),
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "row",
        gap: 10,
        borderWidth: 1,
        borderBottomWidth: 3,
        borderBottomColor: COLOR.primary,
        borderColor: "#ecebeb",
    },
    buttonText: {
        ...TEXT.Caption
    },
});