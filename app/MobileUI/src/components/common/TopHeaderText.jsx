import React from 'react';
import RemixIcon from "react-native-remix-icon";
import {Text, View} from "react-native";
import {COLOR} from "../../utils/theme";

const TopHeaderText = ({icon="user-3-line", label="Hello"}) => {
    return (
        <View style={styles.topHeaderContent}>
            <RemixIcon name={icon} size={22} color="#333" />
            <Text style={styles.topHeaderText}>{label}</Text>
        </View>
    );
};

export default TopHeaderText;

const styles = {
    topHeaderContent: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
    },

    topHeaderText: {
        color: COLOR.textDark,
        fontSize: 18,
        fontFamily: "PoppinsBold",
    },
}