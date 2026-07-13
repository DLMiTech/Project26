import React from 'react';
import {
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import Header from "../../components/header";
import HeaderInfo from "../../components/header_info";
import {COLORS, SIZES} from "../../constants/init";
import {Ionicons} from "@expo/vector-icons";

const History = () => {
    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView style={styles.wrapper}
                                  behavior={Platform.OS === "ios" ? "padding" : "height"}>
                <Header/>
                <HeaderInfo icon={`reader`} name={`HISTORY`}/>

                <ScrollView contentContainerStyle={{ flexGrow: 1}}
                            keyboardShouldPersistTaps="handled">
                    <View style={styles.history_box}>
                        <View style={styles.history_line}>
                            <Text style={styles.title}>Fees Type</Text>
                            <Text style={styles.text}>School fees</Text>
                        </View>
                        <View style={styles.history_line}>
                            <Text style={styles.title}>Amount</Text>
                            <Text style={styles.text}>GHc 2000.00</Text>
                        </View>
                        <View style={styles.history_footer}>
                            <Text style={styles.date}>12-06-2925</Text>
                            <TouchableOpacity style={styles.history_footer_icon}>
                                <Ionicons name="arrow-forward" style={styles.moreIcon}></Ionicons>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={styles.history_box}>
                        <View style={styles.history_line}>
                            <Text style={styles.title}>Fees Type</Text>
                            <Text style={styles.text}>School fees</Text>
                        </View>
                        <View style={styles.history_line}>
                            <Text style={styles.title}>Amount</Text>
                            <Text style={styles.text}>GHc 2000.00</Text>
                        </View>
                        <View style={styles.history_footer}>
                            <Text style={styles.date}>12-06-2925</Text>
                            <TouchableOpacity style={styles.history_footer_icon}>
                                <Ionicons name="arrow-forward" style={styles.moreIcon}></Ionicons>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={styles.history_box}>
                        <View style={styles.history_line}>
                            <Text style={styles.title}>Fees Type</Text>
                            <Text style={styles.text}>School fees</Text>
                        </View>
                        <View style={styles.history_line}>
                            <Text style={styles.title}>Amount</Text>
                            <Text style={styles.text}>GHc 2000.00</Text>
                        </View>
                        <View style={styles.history_footer}>
                            <Text style={styles.date}>12-06-2925</Text>
                            <TouchableOpacity style={styles.history_footer_icon}>
                                <Ionicons name="arrow-forward" style={styles.moreIcon}></Ionicons>
                            </TouchableOpacity>
                        </View>
                    </View>

                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

export default History;
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    wrapper: {
        flex: 1,
        paddingHorizontal: 20,
    },
    history_box: {
        marginTop: 15,
        backgroundColor: COLORS.white,
        padding: 10,
        borderWidth: 1,
        borderColor: COLORS.gray,
        borderRadius: 10,
    },
    history_line: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        borderBottomWidth: 0.5,
        paddingVertical: 8,
        borderColor: COLORS.lightGray
    },
    title: {
        fontSize: 14,
        fontFamily: "medium",
    },
    text: {
        fontSize: 14,
        color: COLORS.gray,
    },
    history_footer: {
        marginTop: 15,
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    date: {
        fontSize: 12,
    },
    history_footer_icon: {
        width: 30,
        height: 30,
        borderWidth: .6,
        borderColor: COLORS.lightGray,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    moreIcon: {
        fontSize: 20,
    }
})