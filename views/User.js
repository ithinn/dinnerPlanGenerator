import React from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { useStorageContext } from "../context/StorageContext";
import { ListItem, Avatar, Text, Header, Image } from "react-native-elements";


export default function User() {

    const storage = useStorageContext();

    return(
        <View style={styles.container}>
            <Header
                placement="right"
                containerStyle={{backgroundColor: "#f9f9f8"}}

                leftComponent={
                    <Image 
                        source={require("../assets/logo.png")}
                        style={{width: 140, height: 50}}/>
                }
            />

            <View style={{marginTop: 25, marginBottom: 25}}>
                <Text h1 h1Style={{textAlign: "center"}}>Min ukeplan</Text>
            </View>
            
            <ScrollView>
            {storage.dinnerList.map((item, index) => {
    
                return(
               <ListItem key={index} bottomDivider>
                   <Avatar size="small" rounded title="VN"/>
                   <ListItem.Content>
                       <ListItem.Title>{item.name}</ListItem.Title>
                   </ListItem.Content>
               </ListItem>
               )
            })}
            </ScrollView>
   
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#f9f9f8',
    },
})