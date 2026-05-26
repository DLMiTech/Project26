import { Dimensions, PixelRatio } from "react-native";

const { width, height } = Dimensions.get("window");

const BASE_WIDTH = 375;
const BASE_HEIGHT = 812;

// ✅ MUST be functions
const scale = (size) => (width / BASE_WIDTH) * size;

const verticalScale = (size) => (height / BASE_HEIGHT) * size;

const moderateScale = (size, factor = 0.5) => {
    return size + (scale(size) - size) * factor;
};

const normalize = (size) => {
    return Math.round(PixelRatio.roundToNearestPixel(moderateScale(size)));
};

export { scale, verticalScale, moderateScale, normalize };