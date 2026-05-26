import React, {useState} from 'react';
import {Text, View} from "react-native";
import ExampleModal from "../app/modals/exampleModal";
import {TEXT} from "../utils/theme";
import DLMInput from "./common/DLMInput";
import DLMOTPInput from "./common/DLMOTPInput";
import DLMButton from "./common/DLMButton";
import DlmRouteButton from "./common/DLMRouteButton";
import Copyright from "./common/copyright";

const delay = (ms: number | undefined) => new Promise(resolve => setTimeout(resolve, ms));

const UseDlm = () => {
    const [phone, setPhone] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [loading, setLoading] = useState(false);
    const [otp, setOtp] = useState("");

    const handleLogin = async () => {
        setLoading(true);
        await delay(2000);
        setLoading(false);
    }
    return (
        <View>
            <View style={styles.container}>
                <Text>Page One</Text>

                {/*<Link asChild push href={`/modals/modal`}>*/}
                {/*    <Button title={`Open Modal`}/>*/}
                {/*</Link>*/}

                <ExampleModal/>

                <Text style={[TEXT.Title]}>Hello World</Text>
                <Text style={TEXT.Subtitle}>Hello World</Text>
                <Text style={TEXT.Body}>Hello World</Text>
                <Text style={TEXT.Caption}>Hello World</Text>



                <DLMInput
                    icon="phone-fill"
                    placeholder="Enter your phone number"
                    keyboardType="numeric"
                    maxLength={10}
                    value={phone}
                    onChangeText={setPhone}
                />

                <DLMInput
                    icon="lock-2-fill"
                    placeholder="Enter your password"
                    secure={true}
                    maxLength={100}
                    value={password}
                    onChangeText={setPassword}
                />

                <DLMOTPInput
                    length={4}
                    onComplete={(code: React.SetStateAction<string>) => setOtp(code)}
                />

                <DLMButton
                    title="Login"
                    loading={loading}
                    disabled={loading}
                    onPress={handleLogin}
                />

                <DLMButton
                    title="Login"
                    variant="outline"
                    loading={loading}
                    disabled={loading}
                    onPress={handleLogin}
                />

                <DlmRouteButton
                    icon="arrow-right-line"
                    type="push"
                    route="/home"
                    size={22}
                    color={""}
                    onPress={""}
                />
                <DlmRouteButton type="back" onPress={""}/>
                <DlmRouteButton
                    icon="home-line"
                    type="replace"
                    route="/dashboard"
                    onPress={""}
                />
                <DlmRouteButton
                    icon="close-line"
                    type="custom"
                    onPress={() => console.log("Closed")}
                    variant={"primary"}
                />

                <Copyright/>
            </View>
        </View>
    );
};

export default UseDlm;