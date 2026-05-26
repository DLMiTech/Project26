import React, { useEffect, useRef } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Animated } from "react-native";
import RemixIcon from "react-native-remix-icon";
import {COLOR as COLORS} from "@/src/utils/theme";


const toastConfig = {
    success: {
        title: "Success",
        icon: "checkbox-circle-fill",
        color: "#16a34a",
    },
    error: {
        title: "Error",
        icon: "close-circle-fill",
        color: "#dc2626",
    },
    warning: {
        title: "Warning",
        icon: "alert-fill",
        color: "#f59e0b",
    },
};

const DLMToast = ({ type = "success", message, onClose, duration = 5000 }) => {
    const translateY = useRef(new Animated.Value(-100)).current;

    useEffect(() => {
        // slide in
        Animated.timing(translateY, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
        }).start();

        // auto close
        const timer = setTimeout(() => {
            handleClose();
        }, duration);

        return () => clearTimeout(timer);
    }, []);

    const handleClose = () => {
        Animated.timing(translateY, {
            toValue: -100,
            duration: 250,
            useNativeDriver: true,
        }).start(() => onClose && onClose());
    };

    const config = toastConfig[type];

    return (
        <Animated.View style={[styles.container, { transform: [{ translateY }] }]}>
            <View style={[styles.toast, { borderLeftColor: config.color }]}>

                <View style={styles.infoContent}>
                    <View style={styles.iconText}>
                        <RemixIcon name={config.icon} size={30} color={config.color} />
                        <Text style={styles.title}>{config.title}</Text>
                    </View>

                    <Text style={styles.message}>{message}</Text>
                </View>

                <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
                    <RemixIcon name="close-line" size={20} color="#999" />
                </TouchableOpacity>

            </View>
        </Animated.View>
    );
};

export default DLMToast;

const styles = StyleSheet.create({
    container: {
        position: "absolute",
        top: 50,
        left: 10,
        right: 10,
        zIndex: 99999,
        elevation: 99999,
    },

    infoContent: {
        flex: 1,
    },

    toast: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 10,
        backgroundColor: "rgba(255,255,255,0.9)",
        padding: 15,
        borderRadius: 2,
        borderLeftWidth: 5,
        elevation: 5,
    },

    iconText: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
    },
    title: {
        fontSize: 18,
        fontWeight: 500,
    },
    message: {
        fontSize: 15,
        color: COLORS.textDark,
        flexWrap: "wrap",
        flexShrink: 1,
    },
    closeButton: {
        width: 35,
        height: 35,
        borderRadius: 50,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#E5E7EB",
        borderWidth: 1,
        borderColor: COLORS.textLight,
    }
});