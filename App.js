import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Modal, Pressable, Text, View, TouchableOpacity, TouchableWithoutFeedback, ScrollView} from 'react-native';
import { usePageContext } from "./context/PageContext"
import { Page } from "./context/PageContext"
import firebaseInstance from "./FirebaseInstance"
import DayItem from "./components/DayItem";
import ModalContent from "./components/ModalContent";

export default function App() {
/*
  let context = usePageContext();

  console.log("context in App", context)
  console.log("database in App", context.database)

  
*/

  const [weekday, setWeekday] = useState([]);
  const [friday, setFriday] = useState([]);
  const [sunday, setSunday] = useState([]);
  const [dinnerList, setDinnerList] = useState(null);
  const [filterList, setFilterList] = useState(null);
  const [database, setDatabase] = useState(null)
  const [isModal, setIsModal] = useState(false);
  const [filterParams, setFilterParams] = useState([]);
  const [selected, setSelected] = useState([]);
/*
  useEffect(() => {
    console.log("context i useEffect", context);
  }, [context])

*/

    
    useEffect(() => {
        readCollection("dinners")
    }, [])


 // console.log("Database in app", database)
    
    async function readCollection(text) {
        try{
          const collection = await firebaseInstance.firestore().collection(text)
          const readCollection = await collection.get()
    
          let returnArray = [];
    
          readCollection.forEach(item => {
            returnArray.push({
              id: item.id,
              ...item.data()
            })
          })
          
          setDatabase(returnArray);
        }
        catch(error) {
          console.log(error)
        }
      }
    

    //Organize courses in weekday,friday and sunday-lists
    useEffect(() => {
        let tempArr = database;

        if (database !== null) {
            const course = item => item.time === 1 || item.time === 2 && item.friday === false && item.sunday === false
            tempArr = filter(course, database)
            setWeekday(tempArr)

            const friday = item => item.friday;
            tempArr = filter(friday, database)
            setFriday(tempArr);

            const sunday = item => item.sunday;
            tempArr = filter(sunday, database)
            setSunday(tempArr);
        }
    }, [database])

  
    const filter = (condition, collection) => {
        const result = [];

        for (let item of collection) {
            if(condition(item)) {
                result.push(item);
            }
        }

        return result;
    }

   // console.log("WEEKSAY", weekday);
    //console.log("FRISAY", friday);
    //console.log("SunSAY", sunday);

    const randomIndex = (arr) => {
      let index = Math.floor(Math.random()*arr.length)
      return index;
  }

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

      console.log("LIST", list)
      setDinnerList(list);
    }


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


const toggleModal = () => {
  setIsModal(!isModal);
}

const handleFilter = ({index, text, type}) => {
  console.log("INDEX", index);
  console.log("Text", text);
  console.log("Type", type);
  setFilterParams([...filterParams, type]);
}

const applyFilter = () => {
  
}

console.log(filterParams);
  return (
    
      <View style={styles.container}>
        
        <Text>DINNER!</Text>

        <TouchableOpacity style={styles.bigButton} onPress={fillDinnerList}>
          <Text style={styles.bigButtonText}>Endre listen</Text>
        </TouchableOpacity>

        <ScrollView>

        <Modal 
            animationType="slide"
            transparent={true}
            visible={isModal}
            onRequestClose={() => {
                Alert.alert("Modal has been closed.");
                setIsModal(!isModal);
            }}
            >
        
        <View style={styles.container}>
            <View style={styles.modalView}>
              <ModalContent tagstyle={styles.tag} handleChange={handleFilter}/>
              <Pressable style={styles.bigButton} onPress={toggleModal}>
                <Text style={styles.bigButtonText}>skru av modal</Text>
              </Pressable>
            </View>
        </View>

        </Modal>

        <Pressable style={styles.bigButton} onPress={toggleModal}>
          <Text style={styles.bigButtonText}>Filter</Text>
        </Pressable>

        <View>
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
  },
  bigButton: {
    backgroundColor: '#333',
    padding: 10,
  },
  bigButtonText: {
    color: "white"
  },
  tag: {
    backgroundColor: "blue",
    margin: 10,
    padding: 10,
  },
  modalView: {
    margin: 20,
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

}
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