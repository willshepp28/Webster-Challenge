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


// Function to create Csv file
const addDataToCSV = (dataToExport) => {
    csvWriter
    .writeRecords(dataToExport)
    .then(()=> console.log('The CSV file was written successfully'));
};


module.exports = addDataToCSV;
