import React from "react";
import { NavigationContainer } from "@react-navigation/native"
import Home from "./views/Home";
import User from "./views/User";
import { enableScreens } from "react-native-screens";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import TabBar from "./components/TabBar";
import {Storage} from "./context/StorageContext"

enableScreens();

const Tabs = createBottomTabNavigator();

export default function App() {
  return (
    <Storage>
      <NavigationContainer>
        <Tabs.Navigator tabBar={props => <TabBar {...props}/>} >
          <Tabs.Screen 
            name="HomeTab" 
            component={Home} 
            options={{
              tabBarLabel: "Ny plan",
              tabBarAccessibilityLabel: "Lag ukeplan"
            }} />

          <Tabs.Screen 
            name="UserTab" 
            component={User}
            options={{
              tabBarLabel: "Min plan",
              tabBarAccessibilityLabel: "Din lagrede ukeplan"
            }}/>
        </Tabs.Navigator>
      </NavigationContainer>
    </Storage>    
  )
}














