// Purpose: Handles the retrieval and handling of data from a given JSON file using AJAX requests.
//          Uses data to generate HTML for nameplates and sends it to the webpage.
//          Keeps track of which console's data to use and how much of the data has been sent to the webpage using index.
//          Sets button functionality to sort for the console specified by the user.

// global variables 
export var index = 0;                                 // keeps track of how much data has been sent to the webpage
export var dataLength;                                // length of the data in use
export var currentPlatform = 'Default';               // the platform to get data for
var newPlatform = false;                              // keeps track of when a new platform has been selected

// sets functionality for buttons in toolbar
export default function setButtons(){
  const btns = document.getElementById('toolbar').getElementsByClassName('btn');   // get buttons in toolbar

  for (var i = 0; i < btns.length; i++){                                           // when each button is clicked
    btns[i].addEventListener("click", setPlatform.bind(null, btns[i].id), false);  // set the platform
    btns[i].addEventListener("click", loadData.bind(null, btns[i].id), false);     // load data for the given platform (defined by its id)
  }

  //const btns = document.getElementById('platforms');      // get dropdown menu selections in toolbar

  /*for (var i = 0; i < btns.length; i++){                                           // when each button is clicked
    btns[i].addEventListener("click", setPlatform.bind(null, btns[i].id), false);  // set the platform
    btns[i].addEventListener("click", loadData.bind(null, btns[i].id), false);     // load data for the given platform (defined by its id)
  }*/
}

export function loadData(platform) {
  var xhr = new XMLHttpRequest();                     // create new HTTP request
  var indexRangeBottom;                               // the bottom of the range of elements to be generated from the json file.
  var indexRangeTop;                                  // the top of the range of elements to be generated from the json file.

  // note that one could host this file a number of different ways.
  xhr.open('GET',                                                                                        // retrieve data from json file.
          'https://raw.githubusercontent.com/RabbitOTM/RabbitOTM.github.io/master/nameplates.json',      // this is the link to the json file via github.
          true);                                                                                         // this is an asynchronous request
  
  xhr.onload = function(){                            // this function runs after loadData() and App() are done because this is an async request
    if(this.status === 200){
        var data = JSON.parse(xhr.responseText);      // store the data from the json file

        if (platform !== 'Default'){                  // if a button has been clicked
          if (newPlatform){
            index = 0;                                // reset index
          }
            if (platform !== 'All'){                  // if the button indicates a specific platform
              data = sortData(data, platform);        // keep only the data with the specified platform
            }
        }

        indexRangeBottom = index;                     // the bottom of the range of elements to be generated from the json file.
        
        if (index + 12 >= data.length){               // if printing another 12 nameplates causes the index to surpass the number of total elements in the file
          indexRangeTop = data.length                 // print until the end of the file instead
        }
        else indexRangeTop = index + 12;              // otherwise, print the next 12 nameplates (this happens everytime we request the file)

        index = indexRangeTop;                        // update index to represent the highest numbered element generated from the file so far
        dataLength = data.length;                     // set global variable so we know when to stop loading

        if (indexRangeTop <= data.length){
          generateNameplates(data, indexRangeBottom, indexRangeTop)       // append new batch of nameplate html to output
        }
        newPlatform = false;                          // this is no longer a new platform         
    }
  }
  xhr.send();                                         // send HTTP request
}

// generates the html for a batch of nameplates, one for each element within the range passed to the function
export function generateNameplates(data, indexRangeBottom, indexRangeTop){
    var output = '';    // initialize html output string

    if (indexRangeBottom === 0){                                        // if this is a new set of data
      document.getElementById("graveyard").innerHTML = '';              // reset html in graveyard
    }
    
  
    for(var i = indexRangeBottom; i < indexRangeTop; i++){
        output += "<div class='nameplate'>"+
        "<img src='"+data[i].image+"' alt='Video Game' ";
  
        if(data[i].platform === ("DS" || "3DS" || "PS1")){
        output += "width='160' height='160'/><br>";                    // to do: change small cover width & height/aspect ratio here #TEMP
        }
        else
        output += "width='160' height='200'}/><br>"; 
  
        output += "<div class='title'>"+data[i].title+"</div><hr>" +     
        "<div class='description'>"+data[i].description+"</div>" +

        "<span class='iconify' data-icon='"+data[i].icon +"'" +
        "data-inline='false' data-width='50px' data-height='50px'></span>" +

        "</div>";                
    }      

    document.getElementById("graveyard").innerHTML += output;          // send html to the div with id="graveyard"
  }

// set the current platform based on the button pressed
  function setPlatform(platform){
    if (currentPlatform !== platform){ // if the user hasn't pressed the same button
      newPlatform = true;              // a button has been pressed, so th  
    }
    
    currentPlatform = platform;        // this is the new current platform
    window.scrollTo(0, 0);             // scroll back to the top of the page
  }

// returns data with only the specified platform
function sortData(data, platform){
  var currentLength = data.length;

  for (var i = 0; i < currentLength; i++){
    if (data[i].platform !== platform){             // if this entry is not from the specified platform
      data.splice(i,1);                             // delete this entry in the data
      currentLength = data.length;                  // update the current length of the data
      i = i - 1;                                    // adjust the element according to new data length
    }
  }

  return data;                                      // return the sorted data
}
