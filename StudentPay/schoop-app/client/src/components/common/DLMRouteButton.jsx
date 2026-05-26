import React from "react";
import { TouchableOpacity, StyleSheet, View } from "react-native";
import { router } from "expo-router";
import RemixIcon from "react-native-remix-icon";

const DlmRouteButton = ({
                            icon = "arrow-left-line",
                            size = 22,
                            color = "#000",
                            type = "back",
                            route = "",
                            onPress,
                            variant = "light", // light | primary
                        }) => {

    const handlePress = () => {
        if (type === "back") {
            router.back();
        } else if (type === "push" && route) {
            router.push(route);
        } else if (type === "replace" && route) {
            router.replace(route);
        } else if (type === "custom" && onPress) {
            onPress();
        }
    };

    const isPrimary = variant === "primary";

    return (
        <TouchableOpacity style={styles.container} onPress={handlePress}>
            <View
                style={[
                    styles.glass,
                    isPrimary ? styles.primaryGlass : styles.lightGlass
                ]}
            >
                <RemixIcon
                    name={icon}
                    size={size}
                    color={color || (isPrimary ? "#005AD4" : "#fff")}
                />
            </View>
        </TouchableOpacity>
    );
};

export default DlmRouteButton;

const styles = StyleSheet.create({
    container: {
        borderRadius: 50,
        overflow: "hidden",
    },

    glass: {
        width: 50,
        height: 50,
        borderRadius: 50,
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 1,
    },

    // For colored backgrounds
    lightGlass: {
        backgroundColor: "rgba(255,255,255,0.2)",
        borderColor: "rgba(255,255,255,0.3)",
    },

    // For white backgrounds
    primaryGlass: {
        backgroundColor: "rgba(0,90,212,0.1)", // #005AD4 with transparency
        borderColor: "rgba(0,90,212,0.3)",
    },
});