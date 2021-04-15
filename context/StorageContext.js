import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {createContext, useContext, useEffect, useState} from "react";

const StorageContext = createContext({
    storage: 0,
    changeStorage: () => {},
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
                //console.log("jsonValue from store USER", jsonValue);

                if (jsonValue !== null) {
                    const parsedJson = JSON.parse(jsonValue);
                    console.log("it's not null");
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
        console.log("save in storage data", data)

        try {
            const jsonValue = JSON.stringify(data);
            console.log("jsonvalue STORAGE", jsonValue);
            setStorage(data);
            await AsyncStorage.setItem(STORAGE_KEY, jsonValue)
        }
        catch(error) {
            console.log("Error, couldnt store");
        }
        /*const storeData = async (value) => {
            try {
                const jsonValue = JSON.stringify(value);
                console.log("jsonvalue STORAGE", jsonValue);
            
                await AsyncStorage.setItem(STORAGE_KEY, jsonValue);
                
            }
            catch (error) {
                console.log("Error, coult not store in local storage")
            }
        };
         storeData(data)*/
       // setDinnerList(data);
    }

    const changeStorage = () => {
        console.log("changestorage skjer");
        setStorage(storage +1);
    }

    return (
        <StorageContext.Provider value={{
            storage,
            changeStorage,
            saveInStorage,
            dinnerList
        }}>{children}</StorageContext.Provider>
    )
}

export const useStorageContext = () => {
    return useContext(StorageContext);
}