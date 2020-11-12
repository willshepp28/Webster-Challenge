


let addDataToCSV = require("../csv.writer");
let fs = require("fs");
let filename = "./w.txt";


// Object which will keep up with the state
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


// Get a position of the string based on the index of the word
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

    for(let i = 0; i < _state.words.length - 1; i++) {
        let currentSection = getSectionOfStringWithIndex(i);
        let definition = getDefinition(currentSection); 
        let description = getDescription(currentSection);
        let disambiguation = getDisambiguation(currentSection);
        
        _state.dataToExport.push({ word: _state.words[i].word, definition: definition, disambiguation: disambiguation, description: description})
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
            console.log(sec)
            let def = getDefinition(sec)
    
            console.log(def)
        }
    });
};





function Build(){
    _state.words = getAllWords();
    addDefinitionsAndWordsToExportArray();
     addDataToCSV(_state.dataToExport);
    
}

Build();



