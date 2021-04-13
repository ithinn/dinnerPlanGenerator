import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Modal, Pressable, Text, View, TouchableOpacity, TouchableWithoutFeedback, ScrollView} from 'react-native';
import { usePageContext } from "./context/PageContext"
import { Page } from "./context/PageContext"
import firebaseInstance from "./FirebaseInstance"
import DayItem from "./components/DayItem";
import ModalContent from "./components/ModalContent";
import {Button, Divider} from "react-native-elements"
import Icon from "react-native-vector-icons/FontAwesome"

export default function App() {
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
        console.log(error)
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
        //console.log("EFFECT where week-lists are filled, filterParams", filterParams, "filteredData: ", filteredData);
        
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


    //General filter function - used throughout the code
    const filter = (condition, collection) => {
        const result = [];

        for (let item of collection) {
            if(condition(item)) {
                result.push(item);
            }
        }

        return result;
    }

    //Get random index from arr
    const randomIndex = (arr) => {
      let index = Math.floor(Math.random()*arr.length)
      return index;
  }

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


const applyFilter = () => {
  let tempArr = database !== null ? [...database] : null;
  let meatArr = [];
  let fishArr = [];
  let vegArr = [];
  let glutArr = [];
  let lactoseArr = [];


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
        console.log("T", tempArr);
        let veg = item => item.type === "veg";
        vegArr = filter(veg, tempArr);
      }
      

    }
  })

  if (fishArr.length > 0 || vegArr.length > 0 || meatArr.length > 0) {
    tempArr = [...fishArr, ...vegArr, ...meatArr];
  }

  console.log("tempArr in apply", tempArr);

  isChecked.filters.forEach(param => {

    
    if (param.checked) {
      console.log("2", param)

      if (param.type === "glutenFree") {
        console.log("it's glutenfree")
        let glut = item => item.type === "glutenFree";
        glutArr = filter(glut, tempArr);
      }
    }
  })
  console.log("glutarr", glutArr);
  console.log("tempArr after flutfilter", tempArr)



  setFilteredData(tempArr);


}

//Changes to a course with time===1 on the days where the user is extra busy
const applyFastFilter = (array) => {

  let list = array;
  let weekDay = [];
  let newCourse; 

  isChecked.filters.forEach(filter => {
    if (filter.index !== undefined && filter.checked === true) {
      weekDay.push(filter.index);
    }
  })

  weekDay.forEach(dayIndex => {
    newCourse = getNewCourse(fastFood);
    list.splice(dayIndex, 1, newCourse);
  })

  return list;
}




//-----------------------------------------------------------Change course
const getNewCourse = (array) => {
  let newIndex = randomIndex(array);
  let newCourse = array[newIndex];

  return newCourse
}


const changeCourse = ({index}) => {
let newArr = [...dinnerList];
console.log("CHANGE")
let newDatabase = [...database];

/*
newDatabase.forEach((dinner, i) => {

  console.log("dinner", dinner.name)
  newArr.forEach(day => {

    
    if (dinner.name === day.name) {
      console.log("day", day.name)
        newDatabase.splice(index, 1);
    }
  })
})

console.log(newDatabase);


for (let i=0; i>newDatabase.length; i++) {
  console.log(newDatabase[i])
  for (let j = 0; j > newArr.length; j++) {
    
  }
}

*/

if (index < 4 || index === 5) {

  newArr[index] = getNewCourse(weekday)


  /*
  newArr.forEach(dinner => {
    if (dinner.name = newArr[index].name) {
      newArr[index] = getNewCourse(weekday)
    }
  })*/


} else if (index === 4) {
  newIndex = randomIndex(friday);
  newArr[index] = friday[newIndex];
} else {
  newIndex = randomIndex(sunday);
  newArr[index] = sunday[newIndex];
}

setDinnerList(newArr);

}
//---------------------------------------------------------------------------------------------


const toggleModal = () => {
  setIsModal(!isModal);
}


const toggleFilters = ({type, text}) => {

  let tempArr = isChecked.filters.map(item => {
    
    if (item.type === type) {
      console.log("itemtype", item.type)
      console.log("type", type);
      return {...item, checked: !item.checked};
    } 

    return item
  })

  setIsChecked({filters: tempArr});

}





  return (
    
      <View style={styles.container}>

        <View >
          <Text style={styles.mainHd}>DINNER!</Text>

          <View style={styles.btnWrap}>
            <Button icon={
              <Icon
                name="arrow-right"
                size={15}
                color="white"
              />
            } title="Ny liste" iconContainerStyle={{padding: 25, margin: 12}} raised={true} onPress={fillDinnerList}/>
            <Button icon={
              <Icon name="filter" size={15} color="white"/>  
            }
              
              title="Filter" titleStyle={{fontSize: 25, padding: 5, margin: 10 }} raised={true} onPress={toggleModal}/>
          
          <Divider style={{height: 5, backgroundColor: "blue"}}/>

          </View>
            
              {isChecked.filters.map((param, index) => {
                let type = param.type;
                
                if (param.checked) {
                  return(
                    <Button
                      title={param.text}
                      key={"btnKey" + index}
                      type="outline"
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
                  icon={
                  <Icon name="times-circle" size={30}/>
                  }
                  onPress={() => {setIsModal(!isModal)}}
                />
                <ModalContent 
        
                  toggleFilter={toggleFilters}
                  isChecked={isChecked.filters}
                  />


                  
                <Pressable style={styles.bigButton} onPress={toggleModal}>
                  <Text style={styles.bigButtonText}>skru av modal</Text>
                </Pressable>

                <Pressable style={styles.bigButton} onPress={() => {setFilterParams([])}}>
                  <Text style={styles.bigButtonText}>tøm filter</Text>
                </Pressable>
              </ScrollView>
          </View>

        </Modal>

        

        <View style={styles.itemWrap}>
          {dinnerList !== null && (
              dinnerList.map((item, index) => {
                return (<DayItem data={item} index={index} handleClick={changeCourse} />)
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