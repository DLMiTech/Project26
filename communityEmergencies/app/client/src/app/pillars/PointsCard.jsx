import React from 'react';
import {Text, TouchableOpacity, View, StyleSheet} from "react-native";
import RemixIcon from "react-native-remix-icon";
import {router} from "expo-router";
import {verticalScale} from "../../utils/scale";
import {COLOR, TEXT} from "../../utils/theme";

const PointsCard = () => {
    return (
        <View style={styles.wrapper}>
            <View style={styles.wrapperContainer}>
                <View style={styles.iconText}>
                    <View style={styles.iconBox}>
                        <RemixIcon
                            name={`medal-fill`}
                            size={25}
                            color={'#005AD4'}
                        />
                    </View>
                    <View>
                        <Text style={TEXT.Caption}>Points</Text>
                        <Text style={styles.point}>1000</Text>
                    </View>
                </View>

                <TouchableOpacity style={styles.changeButton} onPress={() => router.push("")}>
                    <Text style={styles.text}>Transfer</Text>
                    <RemixIcon
                        name={`skip-right-line`}
                        size={18}
                        color={'#fff'}
                    />
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default PointsCard;

const styles = StyleSheet.create({
    wrapper: {
        paddingHorizontal: verticalScale(15),
    },
    text: {
        ...TEXT.Caption,
        color: COLOR.white,
        fontSize: 14
    },
    wrapperContainer: {
        backgroundColor: "rgba(0,90,212,0.1)",
        borderRadius: 10,
        padding: 10,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: "rgba(0,90,212,0.4)",
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        gap: 5,
    },
    iconText: {
        flexDirection: "row",
        alignItems: "center",
        gap: 5,
    },
    changeButton: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: COLOR.primary,
        borderRadius: 5,
        padding: 5
    },
    iconBox: {
        width: 40,
        height: 40,
        backgroundColor: "rgba(0,90,212,0.3)",
        borderRadius: 50,
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 1,
        borderColor: COLOR.primary,
    },
    point: {
        fontSize: 14,
        fontFamily: "PoppinsExtraBold",
        fontWeight: 500,
    },
})