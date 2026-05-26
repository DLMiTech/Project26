import {Dimensions} from "react-native";

const { width, height } = Dimensions.get("window");

const DIMENSIONS = {
    width: width,
    height: height,
}
const COLOR = {
    primary: '#005AD4',//8FBFFF
    secondary: '#B1C9EF',
    background: '#F0F3FA',
    white: '#FFFFFF',
    textDark: '#272a2e',
    textLight: '#878A99FF',
}

const TEXT = {
    Title: {
        fontSize: 28,
        fontFamily: "PoppinsExtraBold",
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