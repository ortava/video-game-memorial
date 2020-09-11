// Purpose: The main functionality of the website happens here. Infinite Scrolling.
//          Intersection Observer functionality is implemented to detect when the user has reached near the bottom of the webpage.
//          When near the bottom of the page, an AJAX call is made by calling loadData from nameplate.js in order to retrieve data and use data from a JSON file.

import React, { useEffect, useState } from 'react'
import { index, dataLength, currentPlatform, loadData } from './nameplates.js'

export default function App() {
  const [setRef, isIntersecting] = useOnScreen(document.getElementById('body'), '100px', 0);

  if ((index !== dataLength) && isIntersecting) {        // if there is more data to be loaded and the target is being intersected
    loadData(currentPlatform);                           // load more data for the selected platform
  }  

  return (                                               // HTML indicating that we've reached the bottom of the page
    <div>
      <div style={{ height: '5vh'}}></div>
      <div
        ref={setRef}                                     // this div is our Intersection Observer's target
        style={{height: '10vh'}}
      >
        <h1
        style={{
        }}>You've reached the end. Congratulations!</h1>
      </div>
    </div>
  );
}

// Hook
function useOnScreen(root, rootMargin, threshold) {
  
  const [ref, setRef] = useState(null);                       // state and setter for storing current ref
  const [isIntersecting, setIntersecting] = useState(false);  // state and setter for storing whether element is visible

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {  // create an IntersectionObserver
        // Update our state when observer callback fires
        setIntersecting(entry.isIntersecting);
      }, {root, rootMargin, threshold});
    
    if (ref) {
      observer.observe(ref);
    }

    return () => {
      if (ref) {
      observer.unobserve(ref);
      }
    };
  }, [ref, root, rootMargin, threshold]);   

  return [setRef, isIntersecting];                            // return ref and whether we are intersecting
}