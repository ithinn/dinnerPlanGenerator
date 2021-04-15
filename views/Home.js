import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Modal, Pressable, View, TouchableOpacity, TouchableWithoutFeedback, ScrollView} from 'react-native';
import firebaseInstance from "../FirebaseInstance"
import DayItem from "../components/DayItem";
import ModalContent from "../components/ModalContent";
import {Button, Divider, Text} from "react-native-elements"
import Icon from "react-native-vector-icons/FontAwesome"
import {filter, randomIndex, userIsBusy, getNewCourse } from "../utils/helperFunctions"
import * as WebBrowser from "expo-web-browser"

export default function Home({route, navigation}) {
  const [isLoading, setIsLoading] = useState(false);
  const [weekday, setWeekday] = useState([]);
  const [friday, setFriday] = useState([]);
  const [sunday, setSunday] = useState([]);
  const [fastFood, setFastFood] = useState([]);
  const [dinnerList, setDinnerList] = useState(null);
  const [filteredData, setFilteredData] = useState([]);
  const [database, setDatabase] = useState([])
  const [isModal, setIsModal] = useState(false);
  const [isChecked, setIsChecked] = useState({
    filters:[
      {type: "meat", checked: false, text: "Kjøtt"},
      {type: "fish", checked: false, text: "Fisk"},
      {type: "veg", checked: false, text: "Vegetar"},
      {type: "glutenFree", checked: false, text: "Glutenfri"},
      {type: "lactoseFree", checked: false, text: "Laktosefri"},
      {type: "mon", checked: false, text: "Mandag", index: 0},
      {type: "tue", checked: false, text: "Tirsdag", index: 1},
      {type: "wed", checked: false, text: "Onsdag", index: 2},
      {type: "thu", checked: false, text: "Torsdag", index: 3},
      {type: "fri", checked: false, text: "Fredag", index: 4},
      {type: "sat", checked: false, text: "Lørdag", index: 5},
      {type: "sun", checked: false, text: "Søndag", index:6},
    ]}
  );

  console.log("route", route);
  console.log("nav", navigation);

  const handleNavigate = () => {
    navigation.navigate("UserTab")
}

  //----------------------------------------------------------------useEffects

  //Get data from Firebase
  useEffect(() => {
    setIsLoading(true);

    async function readCollection(text) {
      try{
        const collection = await firebaseInstance.firestore().collection(text)
        const readCollection = await collection.get()
  
        let returnArray = [];
  
        readCollection.forEach(item => {

          const itemData = item.data() || {};
      
          returnArray.push({
            id: item.id,
            ...itemData
          })
        })
        
        setDatabase(returnArray);
        setIsLoading(false)
      }
      catch(error) {
        setIsLoading(false);
      }
    }

    readCollection("dinners")
  }, [])


  //set filteredData to "database"
  useEffect(() => {
    setFilteredData([...database])
  }, [database]);
    

  //Apply filter when a filter is added/removed
  useEffect(() => { 
    applyFilter();
  }, [isChecked]);


  //Organize courses in weekday,friday and sunday-lists
  useEffect(() => {
      let tempArr = [...filteredData];
    
      if (database !== null) {
          const course = item => item.time === 1 || item.time === 2 && item.friday === false && item.sunday === false
          tempArr = filter(course, filteredData)
          setWeekday(tempArr)

          const friday = item => item.friday;
          tempArr = filter(friday, filteredData)
          setFriday(tempArr);

          const sunday = item => item.sunday;
          tempArr = filter(sunday, filteredData)
          setSunday(tempArr);

          const fastFood = item => item.time === 1;
          tempArr = filter(fastFood, filteredData);
          setFastFood(tempArr);
      }

  }, [filteredData])

  
  //re-fill dinnerList every time weekday changes (i.e: apply filter)
  useEffect(() => {
    if (weekday.length > 0) {
      fillDinnerList();
    }
  }, [weekday]);



  //-------------------------------------------------------------------------------------Fill the dinnerList 

  //Sets the 7 days dinner list based on the weekday, friday and sunday arrays
  const fillDinnerList = () => {
    let list = [];
    let tempWeek = [...weekday];
    let tempFri = [...friday];
    let tempSun = [...sunday];
      
      //Push weekday dinners
    for (let i=0; i <= 4; i++) {
      let index = randomIndex(tempWeek);
      let dinner = tempWeek[index];
      list.push(dinner)
      tempWeek.splice(index, 1);
    }

      //Push friday dinner
    let f = randomIndex(tempFri);
    let fDinner = tempFri[f];
    list.splice(4, 0, fDinner);
    tempFri.splice(f, 1);

      //Push sunday dinner
    let s = randomIndex(sunday);
    let sDinner = tempSun[s];
    list.splice(6, 0, sDinner);
    tempSun.splice(s, 1)

    list = applyFastFilter(list);

    setDinnerList(list);
  }

//---------------------------------------------------------------------------------------------------Filter courses
  const applyFilter = () => {
    let tempArr = database !== null ? [...database] : null;
    let meatArr = [];
    let fishArr = [];
    let vegArr = [];
    let glutArr = [];
    let lactoseArr = [];

    //filters meat, fish and vegetarian courses
    isChecked.filters.forEach(param => {

      if (param.checked) {
        if (param.type === "meat") {
          let meat = item => item.type === "meat";
          meatArr = filter(meat, tempArr)  
        }
        if (param.type === "fish") {
          let fish = item => item.type === "fish";
          fishArr = filter(fish, tempArr);
        } 
        if (param.type === "veg") {
          let veg = item => item.type === "veg";
          vegArr = filter(veg, tempArr);
        }
      }
    })

    if (fishArr.length > 0 || vegArr.length > 0 || meatArr.length > 0) {
      tempArr = [...fishArr, ...vegArr, ...meatArr];
    }

    //filters glutenFree and lactoseFree - based on the tempArr that's already filtered by meat, fish and vegetarian courses
    isChecked.filters.forEach(param => {

      if (param.checked) {
    
        if (param.type === "glutenFree") {
          let glut = item => item.glutenFree;
          glutArr = filter(glut, tempArr); 
        }
        else if (param.type === "lactoseFree") {
          let lac = item => item.lactoseFree;
          lactoseArr = filter(lac, tempArr);
      
        }
      }
    })

    if (glutArr.length > 0 || lactoseArr.length > 0) {
      tempArr = [...glutArr, ...lactoseArr];
    }

    setFilteredData(tempArr);
  } 


//Changes to a course with time===1 on the days where the user is extra busy
const applyFastFilter = (array) => {

  let newDinnerList = array;
  const busyDays = userIsBusy(isChecked.filters);
  let newCourse; 

  busyDays.forEach(dayIndex => {
    newCourse = getNewCourse(dinnerList, fastFood);
    newDinnerList.splice(dayIndex, 1, newCourse);
  })

  return newDinnerList;
}


//Toggles filter parameters based on which buttons the user has pressed
const toggleFilters = ({type}) => {

  let tempArr = isChecked.filters.map(item => {

    if (item.type === type) {
      return {...item, checked: !item.checked};
    } 

    return item
  })

  setIsChecked({filters: tempArr});
}


//shows/hides the modal with filter options
const toggleModal = () => {
  setIsModal(!isModal);
}



//------------------------------------------------------------------------------------------------------Change courses

const changeCourse = ({index}) => {
let newArr = [...dinnerList];

  if (index < 4 || index === 5) {
    newArr[index] = getNewCourse(dinnerList, weekday)
  } else if (index === 4) {
    newArr[index] = getNewCourse(dinnerList, friday)
  } else {
    newArr[index] = getNewCourse(dinnerList, sunday)
  }

newArr = applyFastFilter(newArr);

setDinnerList(newArr);
}

const handleOpenWithWebBrowser = (url) => {
  console.log("webbrowser")
  WebBrowser.openBrowserAsync(url)
}


const saveInLocalStorage = () => {
    console.log("saveinlocalstorage")
}

  return (

    
    <View style={styles.container}>

    

      <View style={{flexDirection: "row", alignItems: "center", marginTop: 70}}>
        <Text h1 >Ukeplan</Text>
        <Button 
            icon={
              <Icon name="filter" size={40} color="white"/>  
            }     
            raised={true} onPress={toggleModal} buttonStyle={{backgroundColor: "#333"}} containerStyle={{height: 50, margin: 10}}/>
         
         <Button title="lagre" onPress={saveInLocalStorage}/>  
      </View>
      <View>
            
              {isChecked.filters.map((param, index) => {
                let type = param.type;
                
                if (param.checked) {
                  return(
                    <Button
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

 

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
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

/*

        <Modal 
            animationType="slide"
            transparent={true}
            visible={false}
            onRequestClose={() => {
                Alert.alert("Modal has been closed.");
                setIsModal(!isModal);
            }}
            ></Modal>
        
        <View style={styles.container}>
            <View style={styles.modalView}>
              <Text>Dette er en popup</Text>
              <Pressable style={styles.bigButton} onPress={toggleModal}>
                <Text style={styles.bigButtonText}>skru av modal</Text>
              </Pressable>
            </View>
        </View>

        <Pressable style={styles.bigButton} onPress={toggleModal}>
          <Text style={styles.bigButtonText}>Filter</Text>
        </Pressable>
        

*/