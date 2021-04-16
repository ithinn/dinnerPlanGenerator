/*import React, {createContext, useContext, useEffect, useState} from "react";
import {filter, randomIndex, userIsBusy, getNewCourse } from "../utils/helperFunctions"

const DinnerContext = createContext({
    weekday: [],
    friday: [],
    sunday: [],
    fastFood: [],
    filteredData: [],
    database: [],
    isChecked: {},
    dinnerList: [],
    test: null,
    checkContext: () => {}
})

export const Dinner = ({children}) => {
  const [loading, setLoading] = false;
  const [weekday, setWeekday] = useState([]);
  const [friday, setFriday] = useState([]);
  const [sunday, setSunday] = useState([]);
  const [fastFood, setFastFood] = useState([]);
  const [dinnerList, setDinnerList] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [test, setTest] = useState(null);
  const [database, setDatabase] = useState([])
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
        console.log("returnArray in context", returnArray);
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
  


  const checkContext = (data) => {
    console.log(data);
    setTest(data)
  }

  console.log("data in context", test)

    return (
        <DinnerContext.Provider value={{
            weekday,
            checkContext,
            test,
            friday,
            sunday,
            fastFood,
            dinnerList,
            filteredData,
            database,
            isChecked
        }}>{children}</DinnerContext.Provider>
    )
}

export const useDinnerContext = () => {
    return useContext(DinnerContext);
}

*/