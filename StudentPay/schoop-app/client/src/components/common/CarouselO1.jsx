import React, {useEffect, useRef, useState} from "react";
import {
    View,
    ImageBackground,
    ScrollView,
    Dimensions,
    StyleSheet,
    Text,
} from "react-native";
import {COLOR} from "@/src/utils/theme";

const { width } = Dimensions.get("window");

const Carousel01 = ({ data }) => {

    const scrollRef = useRef(null);

    const [activeIndex, setActiveIndex] = useState(0);

    // Auto Slide
    useEffect(() => {

        if (data.length <= 1) return;

        const interval = setInterval(() => {

            let nextIndex = activeIndex + 1;

            if (nextIndex >= data.length) {
                nextIndex = 0;
            }

            scrollRef.current?.scrollTo({
                x: nextIndex * width,
                animated: true,
            });

            setActiveIndex(nextIndex);

        }, 5000);

        return () => clearInterval(interval);

    }, [activeIndex]);

    // Manual Swipe
    const handleScroll = (event) => {

        const slide = Math.round(
            event.nativeEvent.contentOffset.x / width
        );

        setActiveIndex(slide);
    };

    return (
        <View>

            <ScrollView
                ref={scrollRef}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onMomentumScrollEnd={handleScroll}
            >

                {data.map((item, index) => (

                    <View
                        key={index}
                        style={styles.slide}
                    >

                        <ImageBackground
                            source={item.image}
                            style={styles.image}
                            imageStyle={styles.imageRadius}
                        >

                            {/* Overlay */}
                            <View style={styles.overlay}>

                                <Text style={styles.title}>
                                    {item.title}
                                </Text>

                                <Text style={styles.description}>
                                    {item.description}
                                </Text>

                            </View>

                        </ImageBackground>

                    </View>

                ))}

            </ScrollView>

            {/* Dots */}
            <View style={styles.dotsContainer}>

                {data.map((_, index) => (

                    <View
                        key={index}
                        style={[
                            styles.dot,
                            activeIndex === index &&
                            styles.activeDot
                        ]}
                    />

                ))}

            </View>

        </View>
    );
};

export default Carousel01;

const styles = StyleSheet.create({

    slide: {
        width: width,
    },

    image: {
        width: "100%",
        height: 180,
    },

    imageRadius: {
        borderRadius: 0,
    },

    overlay: {
        flex: 1,
        justifyContent: "flex-end",
        padding: 20,
        backgroundColor: "rgba(0,0,0,0.15)",
    },

    title: {
        color: "#fff",
        fontSize: 24,
        fontWeight: "700",
        marginBottom: 5,
    },

    description: {
        color: "#F3F4F6",
        fontSize: 14,
    },

    dotsContainer: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        marginTop: 12,
    },

    dot: {
        width: 8,
        height: 8,
        borderRadius: 100,
        backgroundColor: "#D1D5DB",
        marginHorizontal: 4,
    },

    activeDot: {
        width: 24,
        backgroundColor: COLOR.primary,
    },

});