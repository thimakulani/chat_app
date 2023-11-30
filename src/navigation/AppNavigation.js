import {createNativeStackNavigator} from "@react-navigation/native-stack";
import HomeScreen from "../screens/HomeScreen";
import {NavigationContainer} from "@react-navigation/native";
import LoginScreen from "../screens/LoginScreen";
import BottomNav from "./BottomNav";
const Stack = createNativeStackNavigator();
function AppNavigations(){
    return(
            <NavigationContainer>
                <Stack.Navigator>
                    <Stack.Screen name='LoginScreen' component={LoginScreen} options={{headerShown:false, statusBarColor:'#009387',navigationBarColor:'#009387'}}  />
                    <Stack.Screen name='BottomNav' component={BottomNav} options={{headerShown: false}} />
                </Stack.Navigator>
            </NavigationContainer>


    );
}
export default AppNavigations;