import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Modal, Pressable, Text, View, TouchableOpacity, TouchableWithoutFeedback, ScrollView} from 'react-native';
import { usePageContext } from "./context/PageContext"
import { Page } from "./context/PageContext"
import firebaseInstance from "./FirebaseInstance"
import DayItem from "./components/DayItem";
import ModalContent from "./components/ModalContent";

export default function App() {

  const [weekday, setWeekday] = useState([]);
  const [friday, setFriday] = useState([]);
  const [sunday, setSunday] = useState([]);
  const [fastFood, setFastFood] = useState([]);
  const [dinnerList, setDinnerList] = useState(null);
  const [filteredData, setFilteredData] = useState([]);
  const [database, setDatabase] = useState([])
  const [isModal, setIsModal] = useState(false);
  const [filterParams, setFilterParams] = useState([]);
  const [isChecked, setIsChecked] = useState({
    meat: false,
    fish: false,
    veg: false,
    glutenFree: false,
    lactoseFree: false,
});

  
  //console.log("FilteredData Global", filteredData);
  //console.log("Dinnerlist global!", dinnerList)
  //console.log("WEEKSAY global", weekday);
  //console.log("FRISAY global", friday);
  //console.log("SunSAY global", sunday);
  //console.log("Fastfood global", fastFood);

  //Get data from Firebase
  useEffect(() => {
      readCollection("dinners")
  }, [])


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
        }
        catch(error) {
          console.log(error)
        }
      }
    
    //set filteredData to "database"
    useEffect(() => {
      //console.log("Effect database")
      
      setFilteredData([...database])
    }, [database]);
    

    //Apply filter when a new filterParam is added/removed
    useEffect(() => {
      //console.log("Apply is supposed to be called in effect")
      applyFilter();
    }, [filterParams]);



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

    useEffect(() => {
      let tempArr = []

      for (let item in isChecked) {
        //let tempArr;
        console.log("EFFECT", item);
        console.log(isChecked[item]);

        if (isChecked[item]) {
          console.log("klaff på begtingelse")
          tempArr.push(item)
          //setFilterParams([...filterParams, item])
        }
        
      }

     console.log("TEMPARR IN EFFECT", tempArr);
      setFilterParams([...tempArr])
      
    }, [isChecked])

    console.log("FilterParams", filterParams);

    useEffect(() => {
      
      if (weekday.length > 0) {
        //console.log("Nå fylles lista!!");
        fillDinnerList();
      }
 
    }, [weekday]);

    const filter = (condition, collection) => {
        const result = [];

        for (let item of collection) {
            if(condition(item)) {
                result.push(item);
            }
        }

        return result;
    }

    

    const randomIndex = (arr) => {
      let index = Math.floor(Math.random()*arr.length)
      return index;
  }

    const fillDinnerList = () => {
      let list = [];
      let tempWeek = [...weekday];
      let tempFri = [...friday];
      let tempSun = [...sunday];
      
      //console.log("FillDinnerList is called");

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

      console.log("LIST in FillDinnerList", list)
      setDinnerList(list);
    }


const applyFilter = () => {
  let tempArr = database !== null ? [...database] : null;
  let meatArr = [];
  let fishArr = [];
  let vegArr = [];

  console.log("Apply is actually called")

  filterParams.forEach(param => {
    
    //console.log("PARAM", param);

    if (param === "meat") {
      let meat = item => item.type === "meat";
      meatArr = filter(meat, tempArr)
    }
    if (param === "fish") {
      let fish = item => item.type === "fish";
      fishArr = filter(fish, tempArr);
    } 
    if (param === "veg") {
      console.log("T", tempArr);
      let veg = item => item.type === "veg";
      vegArr = filter(veg, tempArr);
    }
  })

  if (fishArr.length > 0 || vegArr.length > 0 || meatArr.length > 0) {
    tempArr = [...fishArr, ...vegArr, ...meatArr];
  }

    //console.log("MEATARR in Applyfilter", meatArr);
    //console.log("fishARR in Applyfilter", fishArr);
    //console.log("vegARR in Applyfilter", vegArr);

    //console.log("TEMPARR in ApplyFilter", tempArr)
    setFilteredData(tempArr);

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


const toggleModal = () => {
setIsModal(!isModal);
}

const handleFilter = () => {
  /*let tempArr = [...filterParams];

  tempArr.forEach((param, index) => {
    if (param === type) {
      tempArr.splice(index, 1);
    } 
  })
  
  if (tempArr.length < filterParams.length) {
    setFilterParams([...tempArr])
  } else {
    setFilterParams([...filterParams, type]);
  }
 
   
  
  */

  
}

const toggleFilterBoxes = ({type}) => {
  console.log("toggle skjer")
  console.log("TYPE IN TOOGGLE", type);

  switch(type) {
    case "meat":
        setIsChecked({...isChecked, meat: isChecked.meat ? false : true});
        break
    case "fish":
        setIsChecked({...isChecked, fish: isChecked.fish ? false : true});
        break
    case "veg":
        setIsChecked({...isChecked, veg: isChecked.veg ? false : true});
        break
    case "glutenFree":
        setIsChecked({...isChecked, glutenFree: isChecked.glutenFree ? false : true});
        break
    case "veg":
        setIsChecked({...isChecked, lactoseFree: isChecked.lactoseFree ? false : true});
        break
        
  }

}




const checkIfItemExcists = item => {
  filterParams.forEach(param => {
    if (param === item) {
      return true
    } 
  })
  return false;


}

//console.log("FILTERPARAMS global", filterParams);
  return (
    
      <View style={styles.container}>

        <View >
          <Text style={styles.mainHd}>DINNER!</Text>

          <View style={styles.btnWrap}>
            <Pressable style={styles.bigButton} onPress={fillDinnerList}>
              <Text style={styles.bigButtonText}>Ny liste</Text>
            </Pressable>

            <Pressable style={styles.bigButton} onPress={toggleModal}>
              <Text style={styles.bigButtonText}>Filtrer</Text>
            </Pressable>
          </View>

        </View>
        

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
              <ModalContent 
                textstyle={styles.tagTxt} 
                tagstyle={styles.tag} 
                handleChange={handleFilter}
                toggleFilter={toggleFilterBoxes}
                isChecked={isChecked}
                checkButtons={checkIfItemExcists}/>
                
              <Pressable style={styles.bigButton} onPress={toggleModal}>
                <Text style={styles.bigButtonText}>skru av modal</Text>
              </Pressable>

              <Pressable style={styles.bigButton} onPress={() => {setFilterParams([])}}>
                <Text style={styles.bigButtonText}>tøm filter</Text>
              </Pressable>
            </View>
        </View>

        </Modal>

        

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
    padding: 10
  },
  btnWrap: {

    flexDirection: "row",
    alignItems: "stretch"
    
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