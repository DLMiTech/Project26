import React from 'react';
import { Tabs } from "expo-router";
import RemixIcon from "react-native-remix-icon";
import { useAuthStore } from "../../utils/useAuthStore";
import {COLOR} from "../../utils/theme";

export default function _TabsLayout() {
    // eslint-disable-next-line react-hooks/rules-of-hooks
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
            backgroundColor: "#0e82d9",
            borderTopWidth: 0,
            elevation: 0,
        },


        tabBarActiveTintColor: COLOR.secondary,
        tabBarInactiveTintColor: COLOR.background,

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
                            color={focused ? '#f3860f' : '#ffe5ec'}
                        />
                    ),
                    tabBarLabel: 'Home',
                }}
            />

            <Tabs.Screen
                name="report"
                options={{
                    tabBarIcon: ({ focused }) => (
                        <RemixIcon
                            name={focused ? 'alarm-warning-fill' : 'alarm-warning-line'}
                            size={24}
                            color={focused ? '#f3860f' : '#ffe5ec'}
                        />
                    ),
                    tabBarLabel: 'Report',
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
                                color={focused ? '#f3860f' : '#ffe5ec'}
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
                            color={focused ? '#f3860f' : '#ffe5ec'}
                        />
                    ),
                    tabBarLabel: 'Profile',
                }}
            />
        </Tabs>
    );
}