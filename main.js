// Purpose: Construct an appropriate number of columns depending on screen width.
//          Fill each column with an appropriate number of nameplates based on length of external json final.
//          Use AJAX to fill nameplates with data from external json file.

var xhr = new XMLHttpRequest();

//note that one could create a server to host this file using node.js, or you could use databases from SQL for example.
xhr.open('GET',                                                                                                     // retrieve data from json file
        'https://raw.githubusercontent.com/RabbitOTM/RabbitOTM.github.io/master/nameplates.json',     // this is the link to the json file via github. 
        true);                                                                                                      // this is an asynchronous operation

xhr.onload = function(){
    if(this.status == 200){
        var data = JSON.parse(xhr.responseText);
        var numberOfColumns = 1;                                  // holds the number of columns to be created (based on screen width)                                      
        var output = '';                                          // initialize html output string

        // include check here to generate a different number of columns depending on screen width
        // for now we will generate exactly 3 columns no matter the width

        // if (viewport="desktop"), numberOfColumns = 3
        numberOfColumns = 3;

        var nameplateRangeBottom = 0;    // initialize bottom end of the range that tracks the indices of the nameplates to be printed in a given column         
        var nameplateRangeTop = 0;       // initialize top end of the range that tracks the indices of the nameplates to be printed 

        for(var i = 0; i < numberOfColumns; i++){
            nameplateRangeBottom = nameplateRangeTop;                                                 // the top of the old range is the bottom of the new range for the next column
            if (i == numberOfColumns - 1)                                                             // if this is the last column
                nameplateRangeTop = data.length                                                       // then include the last item in the file
            else
                nameplateRangeTop = nameplateRangeTop + Math.ceil(data.length / numberOfColumns);     // the top of the new range is found depending on the number of partitions made in the data

            output += generateColumn(data, nameplateRangeBottom, nameplateRangeTop)                   // append column html to the output     
        }

        document.getElementById("graveyard").innerHTML = output;                                      // print html to div with id="graveyard"
    }
}
xhr.send();

function generateColumn(data, nameplateRangeBottom, nameplateRangeTop){
    var output = '<div class="column">';       // start the column div

    for(var i = nameplateRangeBottom; i < nameplateRangeTop; i++){
        output += '<div class="nameplate">'+
        '<img src="'+data[i].image+'" alt="Video Game "';

        if(data[i].console == ("SNES" || "DS" || "3DS" || "PS1")){
        output += 'width="160" height="200"><br>';                     // to do: change small cover width & height/aspect ratio here
        }
        else
        output += 'width="160" height="200"><br>';

        output += '<div class="title">'+data[i].title+'</div><hr>' +     
        '<div class="description">'+data[i].description+'</div>' +
        '</div>';                
    }                                                                 

    output += '</div>';                     // close the column div

    return output;                          // return output so that it may either be sent to innerHTML or appended to if more columns are needed.
}


