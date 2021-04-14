import { StyleSheet, View, TouchableOpacity, Pressable, TouchableWithoutFeedback} from 'react-native';
import React from "react"
import {Button, Text, Card, Icon} from "react-native-elements"
//import { ListItem } from 'react-native-elements/dist/list/ListItem';
import { ListItem, Avatar } from 'react-native-elements'
const DayItem = ( { data, index, handleClick, handleUrl }) => {
 
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
            <View style={{maxWidth: 300, margin: 10}}>
                <Text h4 h4Style={{textTransform: "uppercase"}}>{day}</Text>
                <Text h3>{data.name}</Text>
                <Text h4>{time || "string"}</Text>
            </View>        
            <View style={{flexDirection:"row"}}>
                <Button buttonStyle={{backgroundColor: "#a96dd8"}} icon={
                    <Icon name="undo" size={15} color="white"/>
                    }
                    containerStyle={{margin: 10, width: 120}} titleStyle={{fontSize: 18 }}title="Bytt rett" onPress={() => {handleClick({index})}} />
                <Button
                buttonStyle={{backgroundColor: "#a96dd8"}}
                icon={
                    <Icon name="arrow-right" size={20} color="white"/>
                    }
                    title="Oppskrifter"
                    containerStyle={{margin: 10, width: 120}} 
                    onPress={() => handleUrl(data.url)}
            />
            
            </View>
            <View>
            
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
        marginTop: 20,
        flex: 1,
        justifyContent: "space-between",
        alignItems: "flex-start",
        
  
    },
    
})


//{data.time === 1 ? "20 min" : data.time === 2 ? "30 min" : "45 min +"}

/*<View style={styles.container}>
            <View style={{maxWidth: 180, margin: 10}}>
                <Text h4 h4Style={{textTransform: "uppercase"}}>{day}</Text>
                <Text h3>{data.name}</Text>
                <Text h4>{time || "string"}</Text>
            </View>        
            <View>
                <Button titleStyle={{fontSize: 18 }}title="Bytt rett" onPress={() => {handleClick({index})}} />
                <Button
                    title="oppskrifter"
                    onPress={() => handleUrl(data.url)}
            />
            
            </View>
            <View>
            
            </View>
          
        </View>
*/