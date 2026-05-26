import {SplashScreen, Stack} from "expo-router";
import React, {useEffect} from "react";
import {useFonts} from "expo-font";
import {useAuthStore} from "@/src/utils/useAuthStore";
import {ToastProvider} from "@/src/components/common/ToastProvider";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {

    const { isLoggedIn, hasCompletedOnboarding} = useAuthStore();

    const [fontsLoaded] = useFonts({
        PoppinsBlack: require("../../assets/fonts/Poppins-Black.ttf"),
        PoppinsBold: require("../../assets/fonts/Poppins-Bold.ttf"),
        PoppinsExtraBold: require("../../assets/fonts/Poppins-ExtraBold.ttf"),
        PoppinsExtraLight: require("../../assets/fonts/Poppins-ExtraLight.ttf"),
        PoppinsLight: require("../../assets/fonts/Poppins-Light.ttf"),
        PoppinsMedium: require("../../assets/fonts/Poppins-Medium.ttf"),
        PoppinsExtraLightItalic: require("../../assets/fonts/Poppins-ExtraLightItalic.ttf"),
        PoppinsRegular: require("../../assets/fonts/Poppins-Regular.ttf"),
        PoppinsThin: require("../../assets/fonts/Poppins-Thin.ttf"),
    });

    useEffect(() => {
        if (fontsLoaded) {
            SplashScreen.hideAsync();
        }
    }, [fontsLoaded]);

    if (!fontsLoaded) return null;

    return (
        <ToastProvider>
            <React.Fragment>
                <Stack>
                    <Stack.Protected guard={isLoggedIn}>
                        <Stack.Screen name={'(tabs)'} options={{headerShown: false}} />
                        {/*<Stack.Screen name={'modals/wallet/topUpWallet'} options={{presentation:'transparentModal', headerShown: false}}/>*/}
                        {/*  pillars  */}
                        {/*<Stack.Screen name={'pillars/stipend/stipend'} options={{ headerShown: false}}/>*/}
                    </Stack.Protected>

                    <Stack.Protected guard={!isLoggedIn && hasCompletedOnboarding}>
                        <Stack.Screen name={'auth/sign-in'} options={{headerShown: false}} />
                        <Stack.Screen name={'auth/sign-up'} options={{headerShown: false}} />
                        <Stack.Screen name={'auth/forgot-password'} options={{headerShown: false}}/>
                    </Stack.Protected>

                    <Stack.Protected guard={!hasCompletedOnboarding}>
                        <Stack.Screen name={'onboarding'} options={{headerShown: false}} />
                    </Stack.Protected>
                </Stack>
            </React.Fragment>
        </ToastProvider>
    );
}
