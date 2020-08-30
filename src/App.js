// Purpose: The main functionality of the website happens here. Infinite Scrolling.
//          Intersection Observer functionality is implemented to detect when the user has reached near the bottom of the webpage.
//          When near the bottom of the page, an AJAX call is made in order to retrieve data from a JSON file,
//          Finally, that data is used to generate the HTML for a new batch of nameplates.

import React, { useState, useRef } from 'react'

var index = 0;  // a global value that keeps track of the last element printed by our AJAX call.

export default function App() {
  const ref = useRef('');                             // ref for the element that we want to detect whether on screen
  const moreGames = useMoreGames(ref, '100px');       // call the hook passing in ref and root margin
  var xhr = new XMLHttpRequest();

  // note that one could host this file a number of different ways.
  xhr.open('GET',                                                                                        // retrieve data from json file.
          'https://raw.githubusercontent.com/RabbitOTM/RabbitOTM.github.io/master/nameplates.json',      // this is the link to the json file via github.
          true);                                                                                         // this is an asynchronous operation.
  
  xhr.onload = function(){
    if(this.status === 200){
        var data = JSON.parse(xhr.responseText);      // store the data from the json file
        var output = '';                              // initialize html output string    
        var indexRangeBottom = index;                 // the bottom of the range of elements to be generated from the json file.
        var indexRangeTop = 0;                        // the top of the range of elements to be generated from the json file. 

        if (index + 12 >= data.length){               // if printing another 12 nameplates causes the index to surpass the number of total elements in the file
          indexRangeTop = data.length                 // print until the end of the file instead
        }
        else indexRangeTop = index + 12;              // otherwise, print the next 12 nameplates (this happens everytime we request the file)

        index = indexRangeTop;                        // update index to represent the highest numbered element generated from the file so far

        if (indexRangeTop <= data.length){
          output += generateNameplates(data, indexRangeBottom, indexRangeTop)       // append new batch of nameplate html to output
          document.getElementById("graveyard").innerHTML += output;                 // send html to the div with id="graveyard"
        }
        else xhr.abort();                             // if the top of the range surpasses the size of the file for any reason, abort the request.          
    }
  }
  xhr.send();

  return (                                            // HTML indicating that we've reached the bottom of the page
    <div>
      <div style={{ height: '5vh' }}>
      </div>
      <div
        ref={ref}
        style={{
          height: '15vh',
          backgroundColor: moreGames
        }}
      >
        <h1>You've reached the end. Congratulations!</h1>
      </div>
    </div>
  );
}

// Hook
function useMoreGames(ref, rootMargin = '0px') {
  // State and setter for storing whether element is visible
  const [isIntersecting, setIntersecting] = useState(false);

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        // Update our state when observer callback fires
        setIntersecting(entry.isIntersecting);
      },
      {
        rootMargin
      }
    );
    var myRef = ref.current;
    if (myRef) {
      observer.observe(myRef);
    }
    return () => {
      observer.unobserve(myRef);
    };
  });   

  return isIntersecting;
}

// generates the html for a batch of nameplates, one for each element within the range passed to the function
function generateNameplates(data, indexRangeBottom, indexRangeTop){
  var output = '';

  for(var i = indexRangeBottom; i < indexRangeTop; i++){
      output += "<div class='nameplate'>"+
      "<img src='"+data[i].image+"' alt='Video Game' ";

      if(data[i].console === ("SNES" || "DS" || "3DS" || "PS1")){
      output += "width='160' height='200'/><br>";                     // to do: change small cover width & height/aspect ratio here
      }
      else
      output += "width='160' height='200'}/><br>"; 

      output += "<div class='title'>"+data[i].title+"</div><hr>" +     
      "<div class='description'>"+data[i].description+"</div>" +
      "</div>";                
  }                                                                 

  return output;        // return output
}