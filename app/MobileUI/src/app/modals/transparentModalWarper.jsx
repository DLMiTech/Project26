import React from 'react';
import {View} from "react-native";
import {COLOR} from "../../utils/theme";

const TransparentModalWarper = ({ children }) => {
    return (
        <View style={styles.overlay}>
            <View style={styles.modal}>
                {children}
            </View>
        </View>
    );
};

export default TransparentModalWarper;

const styles = {
    overlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.5)",
        justifyContent: "flex-end"
    },

    modal: {
        backgroundColor: COLOR.background,
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
        minHeight: "90%",
    },
}