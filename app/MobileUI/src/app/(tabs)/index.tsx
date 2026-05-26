import React, {useState} from 'react';
import {
    View,
    Text,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet, TouchableOpacity,
} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";
import Copyright from "@/src/components/common/copyright";
import {StatusBar} from "expo-status-bar";
import {COLOR, TEXT} from "@/src/utils/theme";
import {verticalScale} from "@/src/utils/scale";
import MainHeader from "@/src/components/common/MainHeader";
import Carousel01 from "@/src/components/common/CarouselO1";
import PillarsButton from "@/src/app/pillars/PillarsButton";
import PointsCard from "@/src/app/pillars/PointsCard";


const slides = [
    {
        image: require("../../../assets/images/car/c1.jpg"),
        title: "",
        description: "",
    },
    {
        image: require("../../../assets/images/car/c2.jpg"),
        title: "",
        description: "",
    },
    {
        image: require("../../../assets/images/car/c3.jpg"),
        title: "",
        description: "",
    },
    {
        image: require("../../../assets/images/car/c4.jpg"),
        title: "",
        description: "",
    },
];

const Index = () => {


    return (
        <SafeAreaView style={styles.container}>
            <StatusBar style="dark" />

            <MainHeader/>
            <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ flexGrow: 1 }}
                    keyboardShouldPersistTaps="handled"
                >
                    <PointsCard/>
                    <Carousel01 data={slides}/>
                    <View style={styles.wrapper}>
                        <PillarsButton/>
                        <Copyright/>
                    </View>

                </ScrollView>
            </KeyboardAvoidingView>

        </SafeAreaView>
    );
};

export default Index;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLOR.background,
    },
    wrapper: {
        flex: 1,
        paddingHorizontal: verticalScale(15),
        backgroundColor: COLOR.background,
    },
})