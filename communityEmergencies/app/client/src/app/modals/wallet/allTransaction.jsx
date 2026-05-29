import React, {useEffect, useState} from 'react';
import {KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View} from "react-native";
import TransparentModalWarper from "../transparentModalWarper";
import ModelHeader from "../../../components/common/ModelHeader";
import {moderateScale, verticalScale} from "../../../utils/scale";
import {COLOR} from "../../../utils/theme";
import {useToast} from "../../../components/common/ToastProvider";
import DataLoader from "../../../components/common/DataLoader";

const transactionData = [
    {
        id: 4,
        title: "Netflix Subscription",
        amount: -50,
        balance: 2400,
        date: "2026-05-06T10:30:00",
    },
    {
        id: 1,
        title: "Netflix Subscription",
        amount: -50,
        balance: 2400,
        date: "2026-05-05T10:30:00",
    },
    {
        id: 2,
        title: "Report Top-up",
        amount: 500,
        balance: 2450,
        date: "2026-05-04T14:10:00",
    },
    {
        id: 3,
        title: "Report Top-up",
        amount: 500,
        balance: 2450,
        date: "2026-05-04T14:10:00",
    },
    {
        id: 5,
        title: "Report Top-up",
        amount: 500,
        balance: 2450,
        date: "2026-05-03T14:10:00",
    },
    {
        id: 6,
        title: "Report Top-up",
        amount: 500,
        balance: 2450,
        date: "2026-05-03T14:10:00",
    },
    {
        id: 7,
        title: "Report Top-up",
        amount: 500,
        balance: 2450,
        date: "2026-05-02T14:10:00",
    },
    {
        id: 8,
        title: "Report Top-up",
        amount: 500,
        balance: 2450,
        date: "2026-05-02T14:10:00",
    },

];
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const AllTransaction = () => {
    const [transactions, setTransactions] = useState([])
    const [loading, setLoading] = useState(true)
    const { showToast } = useToast();


    useEffect(() => {
        const getAllTransaction = async () => {
            setLoading(true);
            await delay(2000);
            try {
                setTransactions(transactionData || []);
            } catch (e) {
                const message =
                    e.response?.data?.message ||
                    e.response?.data?.error ||
                    e.message || 'An unexpected error has occurred';
                showToast({
                    type: "error",
                    message: message,
                });
            } finally {
                setLoading(false);
            }
        };
        getAllTransaction()
    }, [])


    const groupTransactions = (data) => {
        const today = new Date().toDateString();
        const yesterday = new Date(Date.now() - 86400000).toDateString();

        const groups = {};

        data.forEach(tx => {
            const txDate = new Date(tx.date).toDateString();

            let label;
            if (txDate === today) label = "Today";
            else if (txDate === yesterday) label = "Yesterday";
            else label = txDate;

            if (!groups[label]) groups[label] = [];
            groups[label].push(tx);
        });

        return groups;
    };

    const grouped = groupTransactions(transactions);


    return (
        <TransparentModalWarper>
            <ModelHeader icon={"wallet-fill"} title={"ALl Transactions"}/>
            <View style={styles.wrapper}>
                <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ flexGrow: 1 }}
                        keyboardShouldPersistTaps="handled">
                        {loading ? (
                            <View>
                                <DataLoader text={`Loading transactions, please wait...`}/>
                            </View>
                            ) : (
                            <View style={styles.transactionContainer}>
                                {Object.keys(grouped).map((group) => (
                                    <View key={group}>
                                        <Text style={styles.groupTitle}>{group}</Text>

                                        {grouped[group].map((item) => (
                                            <View key={item.id} style={styles.transactionCard}>
                                                <View>
                                                    <Text style={styles.txTitle}>{item.title}</Text>
                                                    <Text style={styles.txDate}>
                                                        {new Date(item.date).toLocaleTimeString()}
                                                    </Text>
                                                </View>

                                                <View style={{ alignItems: "flex-end" }}>
                                                    <Text
                                                        style={[
                                                            styles.txAmount,
                                                            { color: item.amount > 0 ? "green" : "red" },
                                                        ]}
                                                    >
                                                        {item.amount > 0 ? "+" : ""}GHS {item.amount}
                                                    </Text>
                                                    <Text style={styles.txBalance}>
                                                        Bal: GHS {item.balance}
                                                    </Text>
                                                </View>
                                            </View>
                                        ))}
                                    </View>
                                ))}
                            </View>
                        )
                        }

                    </ScrollView>
                </KeyboardAvoidingView>
            </View>
        </TransparentModalWarper>
    );
};

export default AllTransaction;

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        paddingVertical: verticalScale(15),
        paddingHorizontal: verticalScale(15),
    },

    transactionContainer: {
        gap: moderateScale(5),
    },

    groupTitle: {
        fontFamily: "PoppinsMedium",
        fontSize: 16,
        marginBottom: moderateScale(5),
    },

    transactionCard: {
        backgroundColor: COLOR.white,
        paddingHorizontal: 10,
        paddingVertical: 15,
        borderRadius: 7,
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 5,
        borderWidth: 1,
        borderColor: "#ecebeb",
    },

    txTitle: {
        fontWeight: "600",
        fontFamily: "PoppinsMedium",
        fontSize: 14,
    },

    txDate: {
        fontSize: 14,
        color: "#777",
        fontFamily: "PoppinsLight",
        marginTop: 4,
    },

    txAmount: {
        fontWeight: "400",
        fontFamily: "PoppinsExtraBold",
    },

    txBalance: {
        fontSize: 14,
        color: "#777",
        fontFamily: "PoppinsLight",
        marginTop: 4,
    },
});