import {SplashScreen, Stack} from "expo-router";
import {useFonts} from "expo-font";
import {useEffect} from "react";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded] = useFonts({
    regular: require('../assets/fonts/Poppins-Regular.ttf'),
    light: require('../assets/fonts/Poppins-Light.ttf'),
    bold: require('../assets/fonts/Poppins-Bold.ttf'),
    medium: require('../assets/fonts/Poppins-Medium.ttf'),
    extraBold: require('../assets/fonts/Poppins-ExtraBold.ttf'),
    semiBold: require('../assets/fonts/Poppins-SemiBold.ttf'),
  })

  useEffect(() => {
    if (loaded){
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) return null;

  return <Stack>
    <Stack.Screen name="index" options={{headerShown: false}} />
    <Stack.Screen name="login" options={{headerShown: false}} />
    <Stack.Screen name="forgot_password" options={{headerShown: false}} />
    <Stack.Screen name="verification" options={{headerShown: false}} />
    <Stack.Screen name="change_password" options={{headerShown: false}} />
    <Stack.Screen name="(tabs)" options={{headerShown: false}} />
  </Stack>;
}
