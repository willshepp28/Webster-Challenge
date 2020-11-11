let addDataToCSV = require("../csv.writer");
let fs = require("fs");
let filename = "./webster.txt";


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
        data.push({word: d[0], index: d.index, wordLength: d[0].length});
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
    // let end = words[index+1].index || words.length - 1;
    let str2 = "";

    for(let i = start; i < end; i++) {
        str2+= _state.fileToString[i]
    }
    return str2;
}


// Search the string; Get the definition; push to array
function getDefinition(section){
    if(!section)return;

    return section.match(/(?<=Defn: ).*\s(?:.+[\n\r])+.*/gm);
}


// Search the string; Get the description; push to array
function getDescription(section){
    if(!section)return;
        
    return section.match(/(?<=\d.).*\s(?:.+[\n\r])+.*/gm);
}



// Finds the definition that corresponds with each word, then adds to array
function addDefinitionsToWords() {
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
    words.forEach((w,index)=> {
        if(w.word === word) {
            let sec = getSectionOfStringWithIndex(index);
            let def = getDefintion(sec)
    
            console.log(def)
        }
    });
};





function Build(){
    _state.words = getAllWords();
     addDefinitionsToWords();
     addDataToCSV(_state.dataToExport);
    
}

Build();




