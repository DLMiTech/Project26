import React, { useEffect, useRef } from 'react';
import { Text, View, Dimensions, StyleSheet, Animated } from 'react-native';
import { PieChart } from 'react-native-chart-kit';

const screenWidth = Dimensions.get('window').width;

const FeesChart = () => {
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const scaleAnim = useRef(new Animated.Value(0.8)).current;

    const data = [
        {
            name: 'Paid',
            population: 2345.00,
            color: '#0b2545',
            legendFontColor: '#0b2545',
            legendFontSize: 15,
        },
        {
            name: 'Owed',
            population: 2000.00,
            color: '#ca5201',
            legendFontColor: '#ca5201',
            legendFontSize: 15,
        },
    ];

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 800,
                useNativeDriver: true,
            }),
            Animated.spring(scaleAnim, {
                toValue: 1,
                useNativeDriver: true,
            }),
        ]).start();
    }, []);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Fees Overview</Text>

            <View style={styles.chartContainer}>
                <Animated.View
                    style={{
                        transform: [{ scale: scaleAnim }],
                        opacity: fadeAnim,
                        position: 'absolute',
                        left: '50%',
                        top: '50%',
                        marginLeft: -screenWidth * 0.45,
                        marginTop: -110,
                    }}
                >
                    <PieChart
                        data={data}
                        width={screenWidth * 0.9}
                        height={220}
                        chartConfig={chartConfig}
                        accessor={'population'}
                        backgroundColor={'transparent'}
                        paddingLeft={'0'}
                        absolute
                        hasLegend={false}
                    />
                </Animated.View>
            </View>

            {/* Custom Legend to the Side of the Chart */}
            <View style={styles.legendContainer}>
                {data.map((item, index) => (
                    <View key={index} style={styles.legendItem}>
                        <View style={[styles.legendColor, { backgroundColor: item.color }]} />
                        <Text style={styles.legendText}>
                            {item.name}: {item.population.toFixed(2)}
                        </Text>
                    </View>
                ))}
            </View>
        </View>
    );
};

const chartConfig = {
    backgroundGradientFrom: '#ffffff',
    backgroundGradientTo: '#ffffff',
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 18,
        marginBottom: 10,
        fontWeight: '600',
        color: '#333',
    },
    chartContainer: {
        width: '100%',
        height: 220,
        position: 'relative',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 20,
    },
    legendContainer: {
        flexDirection: 'row', // Arrange items in a row
        marginTop: 10,
        width: '100%',
        justifyContent: 'center', // Center the legend items
    },
    legendItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 10, // Space between legend items
    },
    legendColor: {
        width: 16,
        height: 16,
        borderRadius: 4,
        marginRight: 10,
    },
    legendText: {
        fontSize: 14,
        color: '#333',
    },
});

export default FeesChart;