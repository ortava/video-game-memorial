/*
TEMPORARY FILE: Remove before pushing to production.

This script was created for the specific purpose
of automating the editing process for the
nameplates.json file.
*/

const { readFileSync } = require('fs');

fs = require('fs');

let json = JSON.parse(fs.readFileSync('./src/nameplates.json').toString());

// Replace each object's image property to its corresponding title + ".png".
//  (The image property represents the file name of image.)
json.forEach(function(e) {
    e.image = e.title.replace(/:/, "") + ".jpg";
});

// Write altered JSON to a new file.
fs.writeFileSync('nameplates.json', JSON.stringify(json, null, "\t"));