import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Modal, View, ScrollView} from 'react-native';
import firebaseInstance from "../FirebaseInstance"
import DayItem from "../components/DayItem";
import ModalContent from "../components/ModalContent";
import {Button, Text, Header, Image} from "react-native-elements"
import Icon from "react-native-vector-icons/FontAwesome"
import {filter, randomIndex, userIsBusy, getNewCourse, handleOpenWithWebBrowser } from "../utils/helperFunctions"
import * as WebBrowser from "expo-web-browser"
import { useStorageContext } from "../context/StorageContext";
import { ActivityIndicator } from 'react-native';
import DevSettings from "react-native";
import { useDinnerContext } from "../context/DinnerContext"


export default function Home() {
    const dinnerContext = useDinnerContext();

    console.log("dinnerContext in home2", dinnerContext)

    return(
<View style={styles.container}>
<Header
  placement="right"
  containerStyle={{
     backgroundColor: "#f9f9f8"
  }}

  leftComponent={
    <Image 
        accessibility={true}
        accessibilityLabel="Logo"
        source={require("../assets/logo.png")}
        style={{width: 140, height: 50}}
        PlaceholderContent={<ActivityIndicator/>}/>
  }

  centerComponent={
    <Button 
        accessibilityLabel="Lagre listen"
        icon={
            <Icon name="save" size={35} color="darkcyan"/>  
        }  
        raised={true}
        type="outline" 
        containerStyle={{height: 50,}}
        onPress={() => {storage.saveInStorage(dinnerList)}}/>  
  }

  rightComponent={
    <Button 
        accessibilityLabel="Åpne filter"
        icon={
            <Icon name="filter" size={40} color="darkcyan"/>  
        }     
        raised={true} 
        onPress={toggleModal} 
        type="outline"
        containerStyle={{height: 50}}/>
}/>

<View style={{flexDirection: "row", alignItems: "center", marginTop: 30}}>
  <Text h1 >Lag ukeplan</Text>
 
</View>
<View>
      
        {isChecked.filters.map((param, index) => {
          let type = param.type;
          
          if (param.checked) {
            return(
              <Button
                  accessibilityHint={`Fjern ${param.text} fra filteret`}
                title={param.text}
                key={"btnKey" + index}
                type="outline"
                raised={true}
                onPress={() => {toggleFilters({type})}}
              />
            )
          }
         
        })
      }

    <View>

    </View>

  </View>
  

  <ScrollView>

  <Modal 
      animationType="fade"
      transparent={true}
      visible={isModal}
      onRequestClose={() => {
          Alert.alert("Modal has been closed.");
          setIsModal(!isModal);
      }}
      >
  
    <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.modalView}>
          <Button
              accessibilityLabel={"Lukk filteroversikt"}
            buttonStyle={{backgroundColor: "#fff"}}
            icon={
            <Icon name="times-circle" size={50}/>
            }
            onPress={() => {setIsModal(!isModal)}}
          />
          <ModalContent 
  
            toggleFilter={toggleFilters}
            isChecked={isChecked.filters}
            />

        </ScrollView>
    </View>

  </Modal>

  

  <View style={styles.itemWrap}>
    {dinnerList !== null && (
        dinnerList.map((item, index) => {
          return (<DayItem handleUrl={handleOpenWithWebBrowser} data={item} index={index} handleClick={changeCourse} />)
        })
    )}
  </View>

  
 
  <StatusBar style="auto" />
  </ScrollView>
</View>

    

    )
}



const styles = StyleSheet.create({
container: {
flex: 1,
backgroundColor: '#f9f9f8',
alignItems: 'center',
justifyContent: 'center',
padding: 10
},
btnWrap: {
width: 100,
flexDirection: "row",
alignItems: "flex-start"

},
bigButton: {
backgroundColor: '#333',
padding: 10,
height: 70,
alignItems: "center",
justifyContent: "center",
margin: 10
},
bigButtonText: {
color: "white"
},
itemWrap: {
maxWidth: 320,

},
mainHd: {
fontSize: 50, 
textAlign: "center",
margin: 10
},
tag: {

margin: 10,
padding: 10,
borderWidth: 1,
},
tagTxt: {
color: "blue",
},
modalView: {
margin: 20,
width: 320,
backgroundColor: "white",
borderRadius: 20,
padding: 35,
alignItems: "center",
shadowColor: "#333",
shadowOffset: {
  width: 0,
  height: 2
},
shadowOpacity: 0.25,
shadowRadius: 4,
elevation: 5 

}, 

});