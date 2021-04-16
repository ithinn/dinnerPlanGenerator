import React, { useEffect, useState } from 'react';
import { StyleSheet, Modal, Pressable, Text, View, TouchableOpacity, TouchableWithoutFeedback, ScrollView, Alert} from 'react-native';
import {CheckBox} from "react-native-elements";


const ModalContent = ( {toggleFilter, isChecked } ) => {

    let iWant = [];
    let imBusy = [];

    isChecked.forEach((item, index) => {
        if (index < 5 ) {
            iWant.push(item);
        } else {
            imBusy.push(item);
        }
    })

    
    return(
        <>
        <View>
            <View style={{marginBottom: 30}}>
                <Text style={{fontSize: 20, textAlign: "center", margin: 10}}>Jeg vil ha: </Text>
            
                {iWant.map((item, index) => {
                    
                    const type = item.type;
        
                    return (
                        <CheckBox
                            key={"cb" + index}
                            accessibilityLabel={item.text}
                            size={30}
                            containerStyle={{backgroundColor: "#e7e7e6"}}
                            textStyle={{fontSize: 18}}
                            title={item.text}
                            checkedIcon='dot-circle-o'
                            uncheckedIcon='circle-o'
                            checked={item.checked}
                            checkedColor={"darkcyan"}
                            uncheckedColor={"#a96dd8"}
                            onPress={() => {toggleFilter({type})}}
                        />
                    )
                })}
            </View>

            <View>
                <Text style={{fontSize: 20, textAlign: "center", margin: 10}}>Jeg har det ekstra travelt: </Text>

                {imBusy.map((item, index) => {
                   
                    const type = item.type;
        
                    return (
                        <CheckBox
                            key={"cb" + index}
                            accessibilityLabel={`Jeg har det travelt på ${item.text}`}
                            containerStyle={{backgroundColor: "#e7e7e6"}}
                            textStyle={{fontSize: 18}}
                            title={item.text}
                            checkedIcon='dot-circle-o'
                            uncheckedIcon='circle-o'
                            checked={item.checked}
                            checkedColor={"darkcyan"}
                            uncheckedColor={"#a96dd8"}
                            onPress={() => {toggleFilter({type})}}
                        />
                    )
                })}
            </View>

        </View>   
        </>
    )
}

export default ModalContent;

