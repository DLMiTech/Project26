import {Dimensions} from "react-native";
const {width, height} = Dimensions.get("window");

const COLORS = {
    primary: "#0b2545",
    secondary: "#ca5201",

    white: "#ffffff",
    offWhite: "#f3f4f8",
    black: "#000000",
    offBlack: "#353535",
    lightWhite: "#fafafc",

    gray: "#888888",
    darkGray: "#444444",
    lightGray: "#DDDDDD",
}

const SIZES = {
    xSmall: 10,
    small: 12,
    medium: 16,
    large: 20,
    xLarge: 24,
    xxLarge: 44,
    height,
    width,
}

const SHADOW = {
    small: {
        shadowColor: "#000",
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.25,
        shadowRadius: 2.84,
        elevation: 2,
    },
    medium: {
        shadowColor: "#000",
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.25,
        shadowRadius: 8.84,
        elevation: 2,
    }
}

export {COLORS, SIZES, SHADOW};