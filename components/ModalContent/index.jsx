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
                            center
                            title={item.text}
                            checkedIcon='dot-circle-o'
                            uncheckedIcon='circle-o'
                            checked={item.checked}
                            checkedColor={"blue"}
                            uncheckedColor={"pink"}
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
                            key={item.type + index}
                            center
                            title={item.text}
                            checkedIcon='dot-circle-o'
                            uncheckedIcon='circle-o'
                            checked={item.checked}
                            checkedColor={"blue"}
                            uncheckedColor={"pink"}
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

