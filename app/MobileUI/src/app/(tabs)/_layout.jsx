import React from 'react';
import { Tabs } from "expo-router";
import RemixIcon from "react-native-remix-icon";
import { useAuthStore } from "../../utils/useAuthStore";
import { BlurView } from "expo-blur";
import {Platform, StyleSheet} from "react-native";
import {COLOR} from "../../utils/theme";

export default function _TabsLayout() {
    const { isAdmin } = useAuthStore();

    const screenOptions = {
        tabBarShowLabel: true,
        tabBarHideOnKeyboard: true,
        headerShown: false,

        tabBarStyle: {
            position: "absolute",
            bottom: 0,
            right: 0,
            left: 0,
            height: 75,
            backgroundColor: Platform.OS === 'ios' ? 'transparent' : '#fff',
            borderTopWidth: 0,
            elevation: 0,
        },

        // 👇 THIS creates the glass effect
        tabBarBackground: () => (

            <BlurView
                intensity={20}
                tint="default"
                style={StyleSheet.absoluteFill}
            />
        ),

        tabBarActiveTintColor: COLOR.primary,
        tabBarInactiveTintColor: COLOR.textLight,

        tabBarLabelStyle: {
            fontSize: 15,
            fontWeight: "500",
        }
    };

    return (
        <Tabs screenOptions={screenOptions}>
            <Tabs.Screen
                name="index"
                options={{
                    tabBarIcon: ({ focused }) => (
                        <RemixIcon
                            name={focused ? 'dashboard-fill' : 'dashboard-line'}
                            size={24}
                            color={focused ? '#005AD4' : '#272a2e'}
                        />
                    ),
                    tabBarLabel: 'Home',
                }}
            />

            <Tabs.Screen
                name="wallet"
                options={{
                    tabBarIcon: ({ focused }) => (
                        <RemixIcon
                            name={focused ? 'wallet-fill' : 'wallet-line'}
                            size={24}
                            color={focused ? '#005AD4' : '#272a2e'}
                        />
                    ),
                    tabBarLabel: 'Wallet',
                }}
            />

            <Tabs.Protected guard={isAdmin}>
                <Tabs.Screen
                    name="admin"
                    options={{
                        tabBarIcon: ({ focused }) => (
                            <RemixIcon
                                name={focused ? 'settings-3-fill' : 'settings-3-line'}
                                size={24}
                                color={focused ? '#005AD4' : '#272a2e'}
                            />
                        ),
                        tabBarLabel: 'Admin',
                    }}
                />
            </Tabs.Protected>

            <Tabs.Screen
                name="profile"
                options={{
                    tabBarIcon: ({ focused }) => (
                        <RemixIcon
                            name={focused ? 'user-3-fill' : 'user-3-line'}
                            size={22}
                            color={focused ? '#005AD4' : '#272a2e'}
                        />
                    ),
                    tabBarLabel: 'Profile',
                }}
            />
        </Tabs>
    );
}