import React, { useEffect, useState } from 'react';
import { StyleSheet, Modal, Pressable, Text, View, TouchableOpacity, TouchableWithoutFeedback, ScrollView, Alert} from 'react-native';
import CheckBox from "@react-native-community/checkbox";


const ModalContent = ( {tagstyle, handleChange} ) => {

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

    return(
        <>
        <Text>Filtrer</Text>

        <View>
            <Text>Jeg vil ha: </Text>
            {filteroptions[0].map((item, index) => {

                const text = item.text;
                const type = item.type;

                return (
                    <Pressable key={item.type + index} style={tagstyle} onPress={() => {handleChange({index, text, type})}}>
                        <Text>{item.text}</Text>
                    </Pressable>
                )
            })}
        </View>


        
        </>
    )
}



export default ModalContent;

