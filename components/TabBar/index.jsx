import React from "react";
import {Button } from "react-native-elements"
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';


function TabBar({ state, descriptors, navigation}) {

  const focusedOptions = descriptors[state.routes[state.index].key].options;
    console.log("state", state);
    console.log("focusedOptions", focusedOptions);


  if (focusedOptions.tabBarVisible === false) {
    return null;
  }

  return (
    <View style={{ flexDirection: 'row' }}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
    
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

     
        return (

          
            <Button
                accessibilityLabel={options.tabBarAccessibilityLabel}
                title={label} 
                onPress={onPress}
                containerStyle={{width: "50%"}}
                titleStyle={{color: isFocused ? "darkcyan" : "darkgray" }} 
                buttonStyle={{backgroundColor: isFocused ? "#f9f9f8": "#e7e7e6"}}/>

         
        );
      })}
    </View>
  );
}

   


export default TabBar;



let styles = StyleSheet.create({
    tabBtn: {
        backgroundColor: "#f0f0f8",
    
    },
    tabTxt: {
        color: "#333"
    }

})

/* return (
        <>
        
      <Button
        title="Go somewhere"
        onPress={() => {
          // Navigate using the `navigation` prop that you received
          navigation.navigate('SomeScreen');
        }}
      />
      <Button
        title="Go any"
        onPress={() => {
          // Navigate using the `navigation` prop that you received
          navigation.navigate('SomeScreen');
        }}
      />
      </>
    );*/