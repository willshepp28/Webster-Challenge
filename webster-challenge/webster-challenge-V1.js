
let fs = require("fs");
let filename = "./webster.txt";
let str = fs.readFileSync(filename).toString();

let createCsvWriter = require('csv-writer').createObjectCsvWriter;
let csvWriter = createCsvWriter({
  path: 'definition.csv',
  header: [
    {id: 'word', title: 'Word'},
    {id: 'definition', title: "Definition"},
    {id: 'disambiguation', title: "Disambiguation"},
    {id: 'description', title: "Description"}
  ]
});

let dataToExport = [];
let words;


// Function to create Csv file
const addDataToCSV = () => {
    csvWriter
    .writeRecords(dataToExport)
    .then(()=> console.log('The CSV file was written successfully'));
}


 // Get all words and corresponding index
 function getAllWords(){
    let regex = /^([A-Z]|[A-Z].*[A-Z])$/gm;
    let data = [];

    while(d = regex.exec(str)) {
        data.push({word: d[0], index: d.index, wordLength: d[0].length});
    }
    return data;
}


// Get a position of the string based on the index of the word
function getSectionOfStringWithIndex(index){
    if(!index) return;

    let start = words[index].index;
    let end;
    if(!words[index+1]) {
        end = words.length--;
    } else {
        end = words[index+1].index;
    }
    // let end = words[index+1].index || words.length - 1;
    let str2 = "";

    for(let i = start; i < end; i++) {
        str2+= str[i]
    }
    return str2;
}


// Search the string; Get the definition; push to array
function getDefintion(section){
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
    for(let i = 0; i < words.length - 1; i++) {
        let currentSection = getSectionOfStringWithIndex(i);
        let definition = getDefintion(currentSection); 
        let description = getDescription(currentSection);
        let disambiguation = getDisambiguation(currentSection);
        
        dataToExport.push({ word: words[i].word, definition: definition, disambiguation: disambiguation, description: description})
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
    words = getAllWords();
     addDefinitionsToWords();
     addDataToCSV();
    
}

Build();




