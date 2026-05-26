import React, {useState} from "react";
import {TextInput, View, StyleSheet, TouchableOpacity} from "react-native";
import RemixIcon from "react-native-remix-icon";
import {COLOR} from "../../utils/theme";

const DLMInput = ({icon, placeholder, value, onChangeText, keyboardType = "default", maxLength, secure = false, error = false,}) => {

    const [showPassword, setShowPassword] = useState(false);
    const [focused, setFocused] = useState(false);

    return (
        <View style={[styles.inputContainer, focused && styles.focusedBorder, error && styles.errorBorder,]}>

            {icon && (
                <RemixIcon name={icon} size={22} color="#595959"/>
            )}

            <TextInput
                style={styles.input}
                placeholder={placeholder}
                keyboardType={keyboardType}
                maxLength={maxLength}
                value={value}
                onChangeText={onChangeText}
                placeholderTextColor="#595959"
                secureTextEntry={secure && !showPassword}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
            />

            {secure && (
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                    <RemixIcon
                        name={showPassword ? "eye-off-line" : "eye-line"}
                        size={22}
                        color="#272a2e"
                    />
                </TouchableOpacity>
            )}

        </View>
    );
};

export default DLMInput;

const styles = StyleSheet.create({
    inputContainer: {
        width: "100%",
        flexDirection: "row",
        alignItems: "center",
        gap: 15,
        paddingHorizontal: 15,
        borderRadius: 40,
        borderWidth: 1,
        borderColor: "#9e9fa8",
    },
    focusedBorder: {
        borderColor: COLOR.primary,
    },

    errorBorder: {
        borderColor: "#e5383b",
    },
    input: {
        flex: 1,
        height: 54,
        fontSize: 18,
        fontFamily: "PoppinsLight",
    }
});