import {createMaterialBottomTabNavigator} from "react-native-paper/react-navigation";
import HomeScreen from "../screens/HomeScreen";
import {useEffect} from "react";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import NetInfo from "@react-native-community/netinfo";
const Tab = createMaterialBottomTabNavigator();

function BottomNav({navigation}){

    const connection = NetInfo.addEventListener((e)=>{
        if(!e.isConnected)
        {
            console.warn('connection lost');
        }
    });
    useEffect(()=>{
        connection();
    },[]);
    return(
        <Tab.Navigator
            screenOptions={{
                tabBarActiveTintColor: '#e91e63',

            }}
        >
            <Tab.Screen name='HomeScreen'
                        component={HomeScreen}
                        options={{headerShown: false,
                            tabBarLabel: 'HOME',
                            tabBarIcon: ({ color }) => (
                                <MaterialCommunityIcons name="home" color={color} size={26} />
                            ),
                        }}

            />

        </Tab.Navigator>
    );
}
export default BottomNav;