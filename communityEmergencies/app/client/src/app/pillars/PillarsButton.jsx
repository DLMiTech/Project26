import React from 'react';
import TwoColumnGrid from "../../components/common/TwoColumnGrid";
import {Text, TouchableOpacity, View, StyleSheet} from "react-native";
import {router} from "expo-router";
import RemixIcon from "react-native-remix-icon";
import {COLOR, TEXT} from "@/src/utils/theme";

const data = [
    {
        index: 1,
        name: "Stipend",
        description: "",
        model: "/pillars/stipend/stipend",
        icon: "wallet-3-line"
    },
    {
        index: 1,
        name: "Forms",
        description: "",
        model: "/pillars/forms/forms",
        icon: "news-line"
    },
    {
        index: 1,
        name: "Hostel",
        description: "",
        model: "/pillars/hostel/hostel",
        icon: "school-line"
    },
    {
        index: 1,
        name: "Internship",
        description: "",
        model: "/pillars/internship/internship",
        icon: "nurse-line"
    }
];

const PillarsButton = () => {
    return (
        <View style={styles.pillars}>
            <TwoColumnGrid>
                {data.map((item, index) => (

                    <TouchableOpacity key={index} style={styles.box} onPress={() => router.push(item.model)}>
                        <View style={styles.iconWrapper}>
                            <RemixIcon
                                name={item.icon}
                                size={25}
                                color={'#005AD4'}
                            />
                        </View>
                        <View style={styles.textWrapper}>
                            <Text style={styles.pillarName}>{item.name}</Text>
                        </View>
                    </TouchableOpacity>

                ))}
            </TwoColumnGrid>

        </View>
    );
};

export default PillarsButton;

const styles = StyleSheet.create({
    pillars: {
        marginTop: 20,
    },
    box: {
        width: "48%",
        borderWidth: 1,
        borderColor: COLOR.primary,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        padding: 2,
    },
    iconWrapper: {
        alignItems: "center",
        padding: 5,
    },
    icon: {
        
    },
    textWrapper: {
        alignItems: "center",
        backgroundColor: COLOR.primary,
        padding: 10,
        borderTopLeftRadius: 5,
        borderTopRightRadius: 5,
    },
    pillarName: {
        ...TEXT.Caption,
        color: COLOR.white,
    }
})