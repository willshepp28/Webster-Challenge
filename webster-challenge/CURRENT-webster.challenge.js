


let addDataToCSV = require("../csv.writer");
let fs = require("fs");
let filename = "./w.txt";


// Object which will hold the state of this application.
let _state = {
    fileToString: fs.readFileSync(filename).toString(),
    words: [],
    dataToExport: []
};



 // Get all words and corresponding index
 function getAllWords(){
    let regex = /^([A-Z]|[A-Z].*[A-Z])$/gm;
    let data = [];

    while(d = regex.exec(_state.fileToString)) {
        if(d[0] === "THE FULL PROJECT GUTENBERG LICENSE") { break;} // temporary solution for regex capturing unnecessary text at the end of file 
        data.push({word: d[0], index: d.index});
    }
    return data;
}


/**
 * 
 * Get a position of the string based on the index of the word
 * 
 * We use the index of each word in our _state.words array to get the corresponding section in the string that belongs to each word (defintion, description, example, ect)
 * getSectionOfStringWithIndex() uses the _state.words.index as a starting position, and the index of the following word in _state.words as a stopping position.
 * Once we have the section we then can use our  getDefinition, getDescription, and getDisambiguation to get the properties we need for our csv file.
 */
function getSectionOfStringWithIndex(index){
    if(!index) return;

    let start = _state.words[index].index;
    let end;
    if(!_state.words[index+1]) {
        end = _state.words.length--;
    } else {
        end = _state.words[index+1].index;
    }
    
    let str2 = "";

    for(let i = start; i < end; i++) {
        str2+= _state.fileToString[i]
    }
    return str2;
}


// Search the string and gets the definition
function getDefinition(section){
    if(!section)return;

    return section.match(/(?<=Defn: ).*\s(?:.+[\n\r])+.*/gm);
}


// Search the string and gets the description; 
function getDescription(section){
    if(!section)return;
        
    return section.match(/(?<=\d.).*\s(?:.+[\n\r])+.*/gm);
}



// Gets the word, definition, description, disambiguation and add it to the dataToExport array, which is used to populate our csv file.
function addDefinitionsAndWordsToExportArray() {
    if(_state.words.length === 0)return;

    for(let index = 0; index < _state.words.length - 1; index++) {
        let currentSection = getSectionOfStringWithIndex(index);
        let definition = getDefinition(currentSection); 
        let description = getDescription(currentSection);
        let disambiguation = getDisambiguation(currentSection);
        
        _state.dataToExport.push({ word: _state.words[index].word, definition: definition, disambiguation: disambiguation, description: description})
    }
}


function getDisambiguation(section){
    if(!section)return;

    return section.match(/(?<=[A-Z]+\n).*/gm);
}


// Gets defintion by name (for testing purposes)
function getDefintionByName(word){
    _state.words.forEach((w,index)=> {
        if(w.word === word) {
            let sec = getSectionOfStringWithIndex(index);
            let def = getDefinition(sec)
        }
    });
};




/**\
 * 
 * 1. Initialize _state.words with all the words 
 * 2. Adds the words, definition, description, and disambiguation to the _state.dataToExport array
 * 3. Create CSV file and populate it with the results of _state.dataToExport
 */
function Build(){
    _state.words = getAllWords();
    addDefinitionsAndWordsToExportArray();
     addDataToCSV(_state.dataToExport);
    
}


Build();



