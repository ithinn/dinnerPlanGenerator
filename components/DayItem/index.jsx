import { StyleSheet, Text, View, TouchableOpacity, Pressable, TouchableWithoutFeedback} from 'react-native';
import React from "react"
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

        <View style={styles.container}>
            <View>
                <Text>{day}</Text>
                <Text>{data.name}</Text>
                <Text>{time || "string"}</Text>
            </View>        
            <View>
                <Pressable style={styles.button} title={"btn" + index} onPress={() => {handleClick({index})}}>
                    <Text style={styles.btnTxt}>Bytt rett</Text>
                </Pressable>
            </View>
          
        </View>
          
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
    button: {
        backgroundColor: "gray",
        width: 50,
        padding: 10,
        margin: 5
    },
    btnTxt: {
        textAlign: "center",
        color: "white"
    }
})


//{data.time === 1 ? "20 min" : data.time === 2 ? "30 min" : "45 min +"}