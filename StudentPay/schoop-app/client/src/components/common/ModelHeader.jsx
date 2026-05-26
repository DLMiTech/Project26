import React from 'react';
import {router} from "expo-router";
import RemixIcon from "react-native-remix-icon";
import {TouchableOpacity, View} from "react-native";
import {verticalScale} from "../../utils/scale";
import {COLOR} from "../../utils/theme";
import TopHeaderText from "./TopHeaderText";

const ModelHeader = ({icon, title}) => {
    return (
        <View style={styles.wrapper}>
            <TouchableOpacity
                onPress={() => {
                    if (router.canGoBack()) {
                        router.back();
                    } else {
                        router.push("/");
                    }
                }} style={styles.backButton}>
                <RemixIcon name={`arrow-left-long-line`} size={22} color="#595959"/>
            </TouchableOpacity>
            <TopHeaderText icon={icon} label={title}/>
        </View>
    );
};

export default ModelHeader;

const styles = {
    wrapper: {
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        backgroundColor: COLOR.white,
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal: verticalScale(15),
        paddingTop: verticalScale(15),
        paddingBottom: verticalScale(10),
        alignItems: "center",
    },
    backButton: {
        padding: 10,
        borderWidth: 1,
        borderRadius: 100,
        borderColor: COLOR.textLight,
    },
}