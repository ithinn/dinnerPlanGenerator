import { StyleSheet, Text, View, TouchableOpacity, Pressable, TouchableWithoutFeedback} from 'react-native';
import React from "react"
import {Button} from "react-native-elements"
//import { ListItem } from 'react-native-elements/dist/list/ListItem';
import { ListItem, Avatar } from 'react-native-elements'
const DayItem = ( { data, index, handleClick }) => {
 
    const day = 
    index === 0 ? "Mandag" : 
    index === 1 ? "Tirsdag" : 
    index === 2 ? "Onsdag" : 
    index === 3 ? "Torsdag" : 
    index === 4 ? "Fredag" : 
    index === 5 ? "Lørdag" : "Søndag"

    const time = 
    data.time === 1 ? "20 min" : 
    data.time === 2 ? "30 min" : "45 min +"

    return(
<>
      

        <View style={styles.container}>
            <View style={{maxWidth: 180, margin: 10}}>
                <Text>{day}</Text>
                <Text>{data.name}</Text>
                <Text>{time || "string"}</Text>
            </View>        
            <View>
                <Button titleStyle={{fontSize: 18 }}title="Bytt rett" onPress={() => {handleClick({index})}} />
            </View>
          
        </View>

        </>
          
    )
}

export default DayItem

const styles = StyleSheet.create({
    container: {
        padding: 10,
        borderWidth: 1,
        borderColor: "blue",
        marginTop: 20,
        flex: 1,
        justifyContent: "space-between",
        alignItems: "center",
        flexDirection: "row",
  
    },
    
})


//{data.time === 1 ? "20 min" : data.time === 2 ? "30 min" : "45 min +"}