import React from 'react';
import {
    SafeAreaView,
    Text,
    View,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    TouchableOpacity,
    ScrollView
} from "react-native";
import Header from "../../components/header";
import {COLORS} from "../../constants/init";
import { LinearGradient } from 'expo-linear-gradient';
import FeesPieChart from "../../components/FeesChart";
import HeaderInfo from "../../components/header_info";


const Home = () => {
    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView style={styles.wrapper}
                                  behavior={Platform.OS === "ios" ? "padding" : "height"}>
                <Header/>
                <HeaderInfo icon={`person`} name={`DASHBOARD`}/>

                <ScrollView contentContainerStyle={{ flexGrow: 1}}
                            keyboardShouldPersistTaps="handled">
                    <View style={styles.home}>
                        <Text style={styles.helloTxt}>Hello </Text>
                        <Text style={styles.welcomeTxt}>Welcome To KTU Pay</Text>
                    </View>


                    <LinearGradient
                        colors={['#0b2545', '#ca5201']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.feesCard}
                    >
                        <Text style={styles.feesToPay}>FEES TO PAY</Text>

                        <View style={styles.amountCard}>
                            <Text style={styles.feesAmount}>2000.00</Text>
                            <Text style={styles.ghc}>GHc</Text>
                        </View>
                    </LinearGradient>

                    <View style={styles.payFees}>
                        <Text>Pay School Fees</Text>
                        <TouchableOpacity onPress={()=> alert("Hello")} style={styles.paySchoolFeesBtn}>
                            <Text style={styles.payBtnText}>PAY</Text>
                        </TouchableOpacity>
                    </View>

                    <FeesPieChart/>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

export default Home;
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    wrapper: {
        flex: 1,
        paddingHorizontal: 20,
    },

    home: {
        width: '100%',
        marginTop: 10,
        display: "flex",
        alignItems: "center",
        flexDirection: "column",
        gap: 8
    },
    helloTxt: {
        fontSize: 16,
        fontFamily: "light",
    },
    welcomeTxt: {
        fontSize: 18,
        fontFamily: "semiBold",
    },

    feesCard: {
        marginTop: 20,
        width: '100%',
        height: 150,
        borderWidth: 1,
        borderRadius: 10,
        borderColor: COLORS.gray,
        padding: 15,
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
    },
    feesToPay: {
        fontSize: 16,
        color: COLORS.white,
    },
    amountCard: {
        display: "flex",
        flexDirection: "row",
        alignItems: "flex-end",
        gap: 8,
    },
    ghc: {
        fontSize: 16,
        color: COLORS.white,
        fontFamily: "extraBold",
    },
    feesAmount: {
        fontSize: 40,
        color: COLORS.white,
        fontFamily: "extraBold",
    },

    payFees: {
        marginTop: 30,
        width: "100%",
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    paySchoolFeesBtn: {
        width: 50,
        height: 50,
        borderRadius: '50%',
        backgroundColor: COLORS.primary,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    },
    payBtnText: {
        color: COLORS.white,
    },
})