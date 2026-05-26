import React, { useState } from "react";
import { View, Text, Button, Modal } from "react-native";

export default function ExampleModal() {
    const [visible, setVisible] = useState(false);

    return (
        <View>
            <Button title="Open Modal 2" onPress={() => setVisible(true)} />

            <Modal visible={visible} animationType="slide" transparent>
                <View style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: "rgba(0,0,0,0.5)"
                }}>
                    <View style={{
                        width: "90%",
                        backgroundColor: "white",
                        padding: 20,
                        borderRadius: 10
                    }}>
                        <Text>This is a modal</Text>
                        <Button title="Close" onPress={() => setVisible(false)} />
                    </View>
                </View>
            </Modal>
        </View>
    );
}