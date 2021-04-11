import React, { useEffect, useState } from 'react';
import { StyleSheet, Modal, Pressable, Text, View, TouchableOpacity, TouchableWithoutFeedback, ScrollView, Alert} from 'react-native';
import {CheckBox} from "react-native-elements";


const ModalContent = ( {toggleFilter, isChecked, checkButtons, tagstyle, textstyle, handleChange} ) => {

    const filteroptions = [
        [
        {text: "Kjøtt", type: "meat"}, 
        {text: "Fisk", type: "fish"}, 
        { text: "Vegetar", type: "veg"}, 
        {text: "Glutenfritt", type: "glutenFree"}, 
        {text: "Laktosefritt", type: "lactoseFree"}],
        ["Mandag", "Tirsdag", "Onsdag", "Torsdag", "Fredag", "Lørdag", "Søndag"],
    ]

  

    const [toggleCheckbox, setToggleCheckbox] = useState(false);

    

    console.log("isChecked", isChecked);
    return(
        <>
        <Text>Filtrer</Text>
        

        <View>
            <Text>Jeg vil ha: </Text>
            {filteroptions[0].map((item, index) => {

                const text = item.text;
                const type = item.type;
               // console.log("ischecked type", isChecked[type], type)
                //const testType = isChecked[type];
                //console.log("TESTTYPE", testType);

                return (

                    <CheckBox
                        center
                        title={text}
                        checkedIcon='dot-circle-o'
                        uncheckedIcon='circle-o'
                        checked={isChecked[type]}
                        checkedColor={"blue"}
                        uncheckedColor={"pink"}
                        onPress={() => {toggleFilter({type})}}
                   
            
        
        />
                    
                )
            })}
        </View>


        
        </>
    )
}



export default ModalContent;

/*<Pressable 
                    key={item.type + index} 
                    style={{color: checkButtons(type) ? "red" : "blue"}} 
                    onPress={() => {handleChange({index, text, type})}}>
                        <Text style={textstyle}>{item.text}</Text>
                    </Pressable>*/