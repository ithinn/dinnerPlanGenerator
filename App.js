import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Pressable, Text, View, TouchableOpacity, TouchableWithoutFeedback, ScrollView} from 'react-native';
//import { usePageContext } from "./context/PageContext"
//import { Page } from "./context/PageContext"
import firebaseInstance from "./FirebaseInstance"
import DayItem from "./components/DayItem";


export default function App() {
/*
  let context = usePageContext();

  console.log("context in App", context)
  console.log("data in App", context.database)

  
*/

  const [weekday, setWeekday] = useState([]);
  const [friday, setFriday] = useState([]);
  const [sunday, setSunday] = useState([]);
  const [dinnerList, setDinnerList] = useState(null);
  const [filterList, setFilterList] = useState(null);
  const [database, setDatabase] = useState(null)
    
    useEffect(() => {
        readCollection("dinners")
    }, [])


  console.log("Database in app", database)
    
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
            console.log("COURSW", course)
            tempArr = filter(course, database)
            setWeekday(tempArr)

            const friday = item => item.friday;
            tempArr = filter(friday, database)
            setFriday(tempArr);

            const sunday = item => item.sunday;
            tempArr = filter(sunday, database)
            setSunday(tempArr);
        }
    }, [])

  
    const filter = (condition, collection) => {
        const result = [];

        for (let item of collection) {
            if(condition(item)) {
                result.push(item);
            }
        }

        return result;
    }

    console.log("WEEKSAY", weekday);
    console.log("FRISAY", friday);
    console.log("SunSAY", sunday);

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




  const changeCourse = (event) => {
    console.log(event.target);
  
    console.log("CHANGE IS COMING");
  }

   
  
  return (

      <View style={styles.container}>
        
        <Text>DINNER!</Text>

        <TouchableOpacity style={styles.bigButton} onPress={fillDinnerList}>
          <Text style={styles.bigButtonText}>Endre listen</Text>
        </TouchableOpacity>

      
        

        <ScrollView>

        <View>
          {dinnerList !== null && (
              dinnerList.map((item, index) => {
                return (<DayItem data={item} index={index} handleClick={event => changeCourse(event)} />)
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
  }
});
