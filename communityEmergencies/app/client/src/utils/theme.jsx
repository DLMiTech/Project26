import {Dimensions} from "react-native";

const { width, height } = Dimensions.get("window");

const DIMENSIONS = {
    width: width,
    height: height,
}
const COLOR = {
    primary: '#0e82d9',//8FBFFF
    secondary: '#f3860f',
    background: '#ffe5ec',
    white: '#FFFFFF',
    textDark: '#353541',
    textLight: '#878A99FF',
}

const TEXT = {
    Title: {
        fontSize: 28,
        fontFamily: "PoppinsExtraBold",
        color: COLOR.textDark
    },
    Subtitle: {
        fontSize: 20,
        fontFamily: "PoppinsMedium",
        color: COLOR.textDark,
    },
    Body: {
        fontSize: 18,
        fontFamily: "PoppinsLight",
    },
    Caption: {
        fontSize: 16,
        fontFamily: "PoppinsLight",
    },
}

export { TEXT, COLOR, DIMENSIONS };