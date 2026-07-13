import React from 'react';
import {COLORS, SIZES} from "@/constants/init";
import {Tabs} from "expo-router";
import {Ionicons} from "@expo/vector-icons";

const _Layout = () => {
    const screenOptions = {
        tabBarShowLabel: true,
        tabBarHideOnKeyboard: true,
        headerShown: false,
        tabBarStyle: {
            position: "absolute",
            bottom: 0,
            right: 0,
            left: 0,
            elevation: 0,
            height: 80
        },
        tabBarActiveTintColor: COLORS.secondary,
        tabBarInactiveTintColor: COLORS.offBlack,
        tabBarLabelStyle: {
            fontSize: SIZES.small,
            fontWeight: "900",
            fontFamily: "semiBold",
        }

    }
    return (
        <Tabs screenOptions={screenOptions}>
            <Tabs.Screen
                name="home"
                options={{
                    tabBarIcon: ({ focused }) => {
                        return <Ionicons name={'grid'} size={23} color={focused ? COLORS.secondary : COLORS.offBlack}/>
                    },
                    tabBarLabel: 'Home',
                }}
            />
            <Tabs.Screen
                name="payment"
                options={{
                    tabBarIcon: ({ focused }) => {
                        return <Ionicons name={'wallet'} size={23} color={focused ? COLORS.secondary : COLORS.offBlack}/>
                    },
                    tabBarLabel: 'Payment',
                }}
            />
            <Tabs.Screen
                name="history"
                options={{
                    tabBarIcon: ({ focused }) => {
                        return <Ionicons name={'reader'} size={23} color={focused ? COLORS.secondary : COLORS.offBlack}/>
                    },
                    tabBarLabel: 'History',
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    tabBarIcon: ({ focused }) => {
                        return<Ionicons name={'person'} size={23} color={focused ? COLORS.secondary : COLORS.offBlack} />
                    },
                    tabBarLabel: 'Profile',
                }}
            />
        </Tabs>
    )
};

export default _Layout;