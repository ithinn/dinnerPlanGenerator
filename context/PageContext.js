/*import React, {createContext, useContext, useEffect, useState} from "react"
import firebaseInstance from "../FirebaseInstance"


const PageContext = createContext({
    dinnerList: null,
    filterList: null,
    changeDinnerList: () => {},
    database: null
  
})

export const Page = ({children}) => {

    const [dinnerList, setDinnerList] = useState(null);
    const [filterList, setFilterList] = useState(null);
    const [database, setDatabase] = useState(null)
    /*
    useEffect(() => {
    
        readCollection("dinners")
 
    }, [])


    console.log("Database in context", database)
    
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
          
          console.log("Firebase in context", returnArray);
          setDatabase(returnArray);
         // return(returnArray);
        }
        catch(error) {
          console.log(error)
        }
      }

    useEffect(() => {

        let tempArr = database;

        if (database !== null) {
            const course = item => item.friday === false;
            tempArr = filter(course, database)

         //   console.log("TEMPARR in context", tempArr);
        }  
    })


    const filter = (condition, collection) => {
        const result = [];

        for (let item of collection) {
            if(condition(item)) {
                result.push(item);
            }
        }

        return result;
    }
    

    const changeDinnerList = (data) => {
       // console.log("a change", data);
        setDinnerList(data);
    } 

    return(
        <PageContext.Provider value = {{
        dinnerList,
        changeDinnerList,
        filterList,
        database
        
        
        }}>{children}</PageContext.Provider>
    )

}

export const usePageContext = () => {
    return useContext(PageContext);
}


*/