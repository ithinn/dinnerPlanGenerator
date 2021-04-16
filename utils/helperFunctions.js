import * as WebBrowser from "expo-web-browser";


//General filter function - used throughout the code.
//Takes a condition and a collection, and filters the collection based on the condition
export const filter = (condition, collection) => {
  const resultArray = [];

  for (let item of collection) {
      if(condition(item)) {
          resultArray.push(item);
      }
  }
  return resultArray;
}


//Gets random index from an array
export const randomIndex = (arr) => {
  let index = Math.floor(Math.random()*arr.length)
  return index;
}


//Returns an array with the index of the days that a user has marked as busy
export const userIsBusy = (array) => {

  const resultArray = []
  
  array.forEach(filter => {
    if (filter.index !== undefined && filter.checked === true) {
      resultArray.push(filter.index);
    }
  })
  
  return resultArray;
}


//Generates a new course, checks if it's already in the dinnerList, and only returns it if it's not. 
export const getNewCourse = (dinnerList, listOfCourses) => {

  let newIndex = randomIndex(listOfCourses);
  let newCourse = listOfCourses[newIndex];
  
  let isCourseAlreadyThere = dinnerList.some(item => item.id === newCourse.id);
    
  return isCourseAlreadyThere ? getNewCourse(dinnerList, listOfCourses) : newCourse;
}

  
//Opens a web browser with the google search for the particular course.   
export const handleOpenWithWebBrowser = (url) => {
  WebBrowser.openBrowserAsync(url)
}
