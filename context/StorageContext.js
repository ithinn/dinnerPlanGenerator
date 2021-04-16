import React, {createContext, useContext, useEffect, useState} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const StorageContext = createContext({
    storage: 0,
    saveInStorage: () => {},
    dinnerList: [],
})

const STORAGE_KEY = "@dinners"

export const Storage = ({children}) => {

    const [storage, setStorage] = useState(null);
    const [dinnerList, setDinnerList] = useState([]);
    
    //Read from localstorage
    useEffect(() => {
        const getData = async () => {
            try {
                const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
 
                if (jsonValue !== null) {
                    const parsedJson = JSON.parse(jsonValue);
                    setDinnerList(parsedJson)
                }
            }
            catch (error) {
                console.log(error);
            }
        }
        getData();
    }, [storage])


    const saveInStorage = async (data) => {
        try {
            const jsonValue = JSON.stringify(data);
            setStorage(data);
            await AsyncStorage.setItem(STORAGE_KEY, jsonValue)
        }
        catch(error) {
            console.log("Error, couldnt store");
        }
    }


    return (
        <StorageContext.Provider value={{
            storage,
            saveInStorage,
            dinnerList
        }}>{children}</StorageContext.Provider>
    )
}

export const useStorageContext = () => {
    return useContext(StorageContext);
}