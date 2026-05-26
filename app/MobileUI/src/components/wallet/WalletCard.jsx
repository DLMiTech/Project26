import React from 'react';
import {Text, View} from "react-native";
import {LinearGradient} from "expo-linear-gradient";
import RemixIcon from "react-native-remix-icon";
import {moderateScale, verticalScale} from "../../utils/scale";
import {COLOR, TEXT} from "../../utils/theme";

const WalletCard = ({amount, name, phone}) => {
    return (
        <View style={styles.cardContainer}>
            <LinearGradient
                colors={["#1e3c72", "#2a5298", "#4facfe"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.walletCard}
            >
                {/* Pattern overlay */}
                <View style={styles.pattern} />

                {/* Top row */}
                <View style={styles.cardHeader}>
                    <Text style={styles.cardTitle}>My Wallet</Text>
                    <RemixIcon name="wallet-3-fill" size={24} color="#fff" />
                </View>

                {/* Balance */}
                <Text style={styles.balanceLabel}>Available Balance</Text>
                <Text style={styles.balanceAmount}>GHS {amount}</Text>

                {/* User info */}
                <View style={styles.cardFooter}>
                    <View>
                        <Text style={styles.cardName}>{name}</Text>
                        <Text style={styles.cardPhone}>{phone}</Text>
                    </View>

                    <Text style={styles.schoolPal}>SchoolPal</Text>
                </View>
            </LinearGradient>
        </View>
    );
};

export default WalletCard;

const styles = {
    cardContainer: {
        marginTop: verticalScale(15),
    },

    walletCard: {
        borderRadius: moderateScale(10),
        padding: verticalScale(20),
        overflow: "hidden",
    },

    pattern: {
        position: "absolute",
        width: "200%",
        height: "200%",
        backgroundColor: "rgba(255,255,255,0.05)",
        transform: [{ rotate: "25deg" }],
    },

    cardHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },

    cardTitle: {
        color: "#fff",
        ...TEXT.Body,
    },

    balanceLabel: {
        color: "#ddd",
        marginTop: verticalScale(15),
        ...TEXT.Caption,
    },

    balanceAmount: {
        color: "#fff",
        ...TEXT.Title,
        fontWeight: "bold",
    },

    cardFooter: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: verticalScale(20),
        alignItems: "center",
    },

    cardName: {
        color: COLOR.white,
        fontWeight: "500",
        fontFamily: "PoppinsMedium",
    },

    cardPhone: {
        color: "#ccc",
        ...TEXT.Caption,
    },

    schoolPal: {
        color: "#fff",
        ...TEXT.Caption,
        letterSpacing: 2,
    },
}