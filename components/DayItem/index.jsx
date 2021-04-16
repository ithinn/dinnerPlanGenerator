import React from "react"
import { StyleSheet, View } from 'react-native';
import { Button, Text } from "react-native-elements"

const DayItem = ( { data, index, handlePress, handleUrl }) => {
 
    const day = 
    index === 0 ? "Mandag" : 
    index === 1 ? "Tirsdag" : 
    index === 2 ? "Onsdag" : 
    index === 3 ? "Torsdag" : 
    index === 4 ? "Fredag" : 
    index === 5 ? "Lørdag" : "Søndag"

    const time = 
    data.time === 1 ? "20 min" : 
    data.time === 2 ? "30 min" : "+30 min"

    return(

        <View style={styles.container}>
            
            <View style={{maxWidth: 300, margin: 10}}>
                <Text h4 h4Style={{textTransform: "uppercase"}}>{day}</Text>
                <Text h3>{data.name}</Text>
                <Text h4>{time}</Text>
            </View>        
            
            <View style={{flexDirection:"row"}}>
                <Button 
                    accessibilityHint={`Bytt til en annen rett på ${day}`}
                    buttonStyle={{backgroundColor: "#a96dd8"}} 
                    containerStyle={{margin: 10, width: 120}} 
                    titleStyle={{fontSize: 18 }}
                    title="Bytt rett" 
                    onPress={() => {handlePress({index})}} />
                <Button
                    accessibilityHint={"Åpne et googlesøk for denne oppskriften i nettleseren din"}
                    buttonStyle={{backgroundColor: "#a96dd8"}}
                    title="Oppskrifter"
                    containerStyle={{margin: 10, width: 120}} 
                    onPress={() => handleUrl(data.url)}
                />
            </View>
        </View>     
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
