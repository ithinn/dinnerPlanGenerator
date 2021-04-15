import React, {createContext, useContext, useEffect, useState} from "react";


const DinnerContext = createContext({
    weekday: [],
    friday: [],
    sunday: [],
    fastFood: [],
    filteredData: [],
    database: [],
    isChecked: {},
    dinnerList: []
    
})

export const Dinner = ({children}) => {
    
  const [weekday, setWeekday] = useState([]);
  const [friday, setFriday] = useState([]);
  const [sunday, setSunday] = useState([]);
  const [fastFood, setFastFood] = useState([]);
  const [dinnerList, setDinnerList] = useState(null);
  const [filteredData, setFilteredData] = useState([]);
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

    return (
        <DinnerContext.Provider value={{
            weekday,
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