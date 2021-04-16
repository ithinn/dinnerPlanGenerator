import React, { useEffect, useState } from 'react';
import firebaseInstance from "../FirebaseInstance"
import 
  DevSettings, 
  { 
  ActivityIndicator, 
  StyleSheet, 
  Modal, 
  View, 
  ScrollView 
  } from 'react-native';
import {Button, Text, Header, Image} from "react-native-elements"
import Icon from "react-native-vector-icons/FontAwesome"
import DayItem from "../components/DayItem";
import ModalContent from "../components/ModalContent";
import {
  filter, 
  randomIndex, 
  userIsBusy, 
  getNewCourse, 
  handleOpenWithWebBrowser } from "../utils/helperFunctions"
import { useStorageContext } from "../context/StorageContext";


export default function Home() {

  const [error, setError] = useState(null);
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

  const storage = useStorageContext();
  
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
        setError(error);
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

  
  //re-fill dinnerList every time the weekday-array changes
  useEffect(() => {
    if (weekday.length > 0) {
      fillDinnerList();
    }
  }, [weekday]);


  //---------------------------------------------------------------------------Fill the dinnerList 

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

    list = applyBusyDaysFilter(list);

    setDinnerList(list);
  }

  //----------------------------------------------------------------------------Filter courses
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
  const applyBusyDaysFilter = (array) => {

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


//---------------------------------------------------------------------------------Change courses
  //Changes the course of a certain index in the dinnerList
  const changeCourse = ({index}) => {
    let newArr = [...dinnerList];

      if (index < 4 || index === 5) {
        newArr[index] = getNewCourse(dinnerList, weekday)
      } else if (index === 4) {
        newArr[index] = getNewCourse(dinnerList, friday)
      } else {
        newArr[index] = getNewCourse(dinnerList, sunday)
      }

    newArr = applyBusyDaysFilter(newArr);

    setDinnerList(newArr);
  }


  if (error) {
    return (
      <View style={styles.container}>
        <Text h3>{error.message}</Text>
        <Button title="Prøv igjen" onPress={() => DevSettings.reload()} />
      </View> 
    )
  }

  if (isLoading) {
    return(
      <View style={styles.container}>
        <ActivityIndicator/>
        <Text h3>Siden lastes inn.</Text>
      </View>
      
    )
  }


  return (
  
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
              source={require("../assets/logo_purple.png")}
              style={{width: 140, height: 50}}
              PlaceholderContent={<ActivityIndicator/>}/>
        }

        centerComponent={
          <Button 
              accessibilityLabel="Lagre listen"
              icon={
                  <Icon name="save" size={35} color="#a96dd8"/>  
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
                  <Icon name="filter" size={40} color="#a96dd8"/>  
              }     
              raised={true} 
              onPress={toggleModal} 
              type="outline"
              containerStyle={{height: 50}}/>
      }/>

      <View style={{flexDirection: "row", alignItems: "center", marginTop: 30}}>
        <Text h1 >Lag ukeplan</Text>
      </View>
      
      <View style={{marginBottom: 10}}>         
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
         
        })}
      </View>
      <Modal 
          
          transparent={true}
          visible={isModal}
          onRequestClose={() => {
              setIsModal(!isModal);
          }}>
        
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
        
      <ScrollView>
        <View style={styles.itemWrap}>
          {dinnerList !== null && (  
            dinnerList.map((item, index) => {
              return (
                <DayItem 
                  handleUrl={handleOpenWithWebBrowser} 
                  data={item} 
                  index={index}
                  key={index + "dayItem"} 
                  handlePress={changeCourse} />
              )
            })
          )}
        </View>
      </ScrollView>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f8',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10
  },
  itemWrap: {
    maxWidth: 320,
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
