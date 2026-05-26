import React from "react";
import { View, StyleSheet } from "react-native";
import { moderateScale } from "../../utils/scale";

const TwoColumnGrid = ({ children }) => {

    return (
        <View style={styles.container}>
            {children}
        </View>
    );
};

export default TwoColumnGrid;

const styles = StyleSheet.create({

    container: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
        gap: moderateScale(12),
    },

});