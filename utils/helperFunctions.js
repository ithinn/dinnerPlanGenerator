//General filter function - used throughout the code
export const filter = (condition, collection) => {
    const result = [];

    for (let item of collection) {
        if(condition(item)) {
            result.push(item);
        }
    }

    return result;
}

//Get random index from arr
export const randomIndex = (arr) => {
    let index = Math.floor(Math.random()*arr.length)
    return index;
}

//Returns an array with the index of the days that a user is busy
export const userIsBusy = (array) => {

    const arr = []
  
    array.forEach(filter => {
      if (filter.index !== undefined && filter.checked === true) {
        arr.push(filter.index);
      }
    })
  
    return arr;
}

export const getNewCourse = (dinnerList, listOfCourses) => {

    let newIndex = randomIndex(listOfCourses);
    let newCourse = listOfCourses[newIndex];
  
    let isCourseAlreadyThere = dinnerList.some(item => item.id === newCourse.id);
    
    return isCourseAlreadyThere ? getNewCourse(dinnerList, listOfCourses) : newCourse;
  }

/*
  const applyFilter = () => {
    let filteredCourses = database.filter((course) => {
      
      const lactoseIsChecked = isChecked.filters.find(filter => filter.type === "lactoseFree").checked;
      console.log(lactoseIsChecked); 

      return isChecked.filters.some(filter => {
        if (filter.checked) {

          if (filter.type === "lactoseFree") {
            return course.lactoseFree
          }
          if (filter.type === "glutenFree") {
            return course.glutenFree
          }


          return filter.type === course.type
        } else {
          return false;
        }
      })

    })

    //console.log("filteredcourses in appl")

    setFilteredData(filteredCourses)


  }
  console.log(filteredData);
  console.log(dinnerList);*/