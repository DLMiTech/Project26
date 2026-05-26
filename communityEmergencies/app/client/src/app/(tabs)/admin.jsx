import {
    Text,
    View,
    StyleSheet,
    Platform,
    KeyboardAvoidingView,
    ScrollView
} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";
import Copyright from "../../components/common/copyright";
import React from "react";

export default function Admin() {

    return (
        <SafeAreaView style={{flex: 1, paddingHorizontal: 10}}>

            <KeyboardAvoidingView style={{flex: 1}}
                                  behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
                <ScrollView contentContainerStyle={{paddingBottom: 40}}
                            keyboardShouldPersistTaps="handled">

                    <View style={styles.container}>
                        <View style={styles.container}>
                            <Text>Only Admin Page</Text>


                            <Copyright/>
                        </View>
                    </View>

                </ScrollView>
            </KeyboardAvoidingView>

        </SafeAreaView>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 20,
    },
    wrapper: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        gap: 25
    },
})