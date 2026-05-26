import React from "react";
import {
    Text,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator,
    View
} from "react-native";
import { COLOR } from "../../utils/theme";

const DLMButton = ({
                       title = "Button",
                       onPress,
                       loading = false, disabled = false, variant = "solid"}) => {

    const isDisabled = loading || disabled;
    const isOutline = variant === "outline";

    return (
        <TouchableOpacity
            style={[
                styles.buttonContainer,
                isOutline && styles.outlineButton,
                isDisabled && styles.disabledButton
            ]}
            onPress={onPress}
            disabled={isDisabled}
            activeOpacity={0.8}
        >
            {loading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator
                        size="small"
                        color={isOutline ? COLOR.primary : COLOR.white}
                    />
                    <Text
                        style={[
                            styles.buttonText,
                            isOutline && styles.outlineText
                        ]}
                    >
                        Loading...
                    </Text>
                </View>
            ) : (
                <Text
                    style={[
                        styles.buttonText,
                        isOutline && styles.outlineText
                    ]}
                >
                    {title}
                </Text>
            )}
        </TouchableOpacity>
    );
};

export default DLMButton;

const styles = StyleSheet.create({
    buttonContainer: {
        width: "100%",
        height: 50,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 40,
        backgroundColor: COLOR.secondary,
    },

    outlineButton: {
        backgroundColor: "transparent",
        borderWidth: 1.5,
        borderColor: COLOR.secondary,
    },

    disabledButton: {
        opacity: 0.6
    },

    loadingContainer: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10
    },

    buttonText: {
        fontSize: 18,
        fontFamily: "PoppinsMedium",
        color: COLOR.white
    },

    outlineText: {
        color: COLOR.primary
    }
});