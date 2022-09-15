/*
TEMPORARY FILE: Remove before pushing to production.

This script was created for the specific purpose
of automating the process for downloading image files
to be added to the /public/covers folder.
*/

const https = require('https');
const fs = require('fs');

// Parse JSON from the old nameplates.json file 
//  (re-added as old-nameplates.json here).
let json = JSON.parse(fs.readFileSync('./old-nameplates.json').toString());

json.forEach(function(e) {
    // Create a stream to start writing a new file.
    const file = fs.createWriteStream(e.title.replace(/:/, "") + ".jpg");

    const request = https.get(e.image, function(response) {
        // Pipe image file from the https url into the new file being written.
        response.pipe(file);

        // Close new file.
        file.on("finish", () => {
            file.close();
            console.log("Download Complete: " + e.image);
        });
    });
});

