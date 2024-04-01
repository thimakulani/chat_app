import {createMaterialBottomTabNavigator} from "react-native-paper/react-navigation";
import HomeScreen from "../screens/HomeScreen";
import {useEffect} from "react";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import NetInfo from "@react-native-community/netinfo";
import VideoScreen from "../screens/VideoScreen";
import FriendsScreen from "../screens/FriendsScreen";
import NotificationsScreen from "../screens/NotificationsScreen";

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

            barStyle={{
                height: 40,
                justifyContent: 'center',
            }}
            screenOptions={
            {
                tabBarActiveTintColor: '#e91e63',

            }}
        >
            <Tab.Screen name='HomeScreen'
                        component={HomeScreen}
                        options={{headerShown: false,
                            title:'',
                            tabBarIcon: ({ color }) => (
                                <MaterialCommunityIcons name="home" color={color} size={20} />
                            ),
                        }}

            />
            <Tab.Screen name='VideoScreen'
                          component={VideoScreen}
                          options={{headerShown: false,
                              title:'',
                              tabBarIcon: ({ color }) => (
                                  <MaterialCommunityIcons name="video" color={color} size={20} />
                              ),
                          }}

             />
            <Tab.Screen name='FriendsScreen'
                        component={FriendsScreen}
                        options={{headerShown: false,
                            title:'',
                            tabBarIcon: ({ color }) => (
                                <MaterialCommunityIcons name="account-supervisor"  color={color} size={20} />
                            ),
                        }}

            />
            <Tab.Screen name='NotificationsScreen'
                        component={NotificationsScreen}
                        options={{headerShown: false,
                            title:'',
                            tabBarIcon: ({ color }) => (
                                <MaterialCommunityIcons name="bell-ring" color={color} size={20} />
                            ),
                        }}

            />



        </Tab.Navigator>
    );
}
export default BottomNav;