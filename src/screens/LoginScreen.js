import {SafeAreaView, Text, View} from "react-native";
import login_style from "../stylesheet/login_style";
import {StatusBar} from "expo-status-bar";
import {Button, TextInput} from 'react-native-paper';
import BottomNav from "../navigation/BottomNav";

function LoginScreen({navigation})
{
    return(
        <SafeAreaView>
            <View>

                <View style={login_style.top_view}>
                    <Text style={login_style.text_header}>WELCOME</Text>
                </View>
                <View style={login_style.input_container} >
                    <TextInput
                        mode="outlined"
                        label="Outlined input"
                        placeholder="Type something"
                        style={login_style.input}
                        right={<TextInput.Icon icon="email" />}
                    />
                    <TextInput
                        mode="outlined"
                        label="Password"
                        placeholder="Password"
                        style={login_style.input}
                        secureTextEntry={true}
                        right={<TextInput.Icon icon="lock" />}
                    />
                    <Button style={{margin: 10, backgroundColor:'#009387', borderRadius:5}} mode="contained" onPress={() => navigation.navigate('BottomNav')}>
                        Login
                    </Button>
                    <Button style={{margin: 10, backgroundColor:'#7aa19e', borderRadius:5}} mode="contained" onPress={() => console.log('Pressed')}>
                        Sign In
                    </Button>
                </View>
            </View>
        </SafeAreaView>
    )
}
export default LoginScreen;