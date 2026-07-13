import { SafeAreaView, Text, View, StyleSheet, Image, TouchableOpacity } from "react-native";
import { StatusBar } from "expo-status-bar";
import { COLORS, SIZES } from "@/constants/init";
import { router } from "expo-router";

const Index = () => {
    return (
        <SafeAreaView style={styles.container}>
            <StatusBar style={'light'} />
            <View style={styles.wrapper}>
                <View style={styles.content}>
                    <Image
                        source={require('@/assets/images/ktu_logo.png')}
                        style={styles.image}
                        resizeMode="contain"
                    />
                    <Text style={styles.lightText}>WELCOME TO</Text>
                    <Text style={styles.boldText}>KTU PAY</Text>
                    <Text style={styles.smallText}>Your secure fees payment solution</Text>
                </View>

                <View style={styles.footer}>
                    <TouchableOpacity style={{width:'100%'}} onPress={() => router.push("/login")}>
                        <Text style={styles.startBtn}>Get Started</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
};

export default Index;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.primary
    },
    wrapper: {
        flex: 1,
        justifyContent: "space-between",
        alignItems: "center",
        padding: 20,
    },
    content: {
        alignItems: "center",
        marginTop: 80,
    },
    image: {
        width: 140,
        height: 140,
        marginBottom: 40
    },
    lightText: {
        fontSize: SIZES.medium,
        fontFamily: "medium",
        color: COLORS.white,
    },
    boldText: {
        fontSize: SIZES.xxLarge,
        fontFamily: "extraBold",
        color: COLORS.white,
    },
    smallText: {
        fontSize: SIZES.small,
        color: COLORS.white,
        marginTop: 10,
    },
    footer: {
        width: '100%',
        alignItems: 'center',
        marginBottom: 30,
    },
    startBtn: {
        backgroundColor: COLORS.secondary,
        color: COLORS.white,
        paddingVertical: 12,
        paddingHorizontal: 40,
        borderRadius: 5,
        fontWeight: "bold",
        fontSize: 16,
        width: '100%',
        textAlign: "center",
    }
});
