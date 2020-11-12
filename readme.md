# Webster Dictionary Challenge


## Requirements
Take this file: http://www.gutenberg.org/cache/epub/29765/pg29765.txt (it's a Webster's English Dictionary) and parse out the words and definitions into the best structured data you can. Worst would be (Word, Raw Definition). Best would be something like (Word, Array of (Disambiguation, Description, Definition, Example)). Send me back the best CSV file (or files) you can build and the code you wrote to build it.


## Technologies & Packages Used
    * Node - is an open source, cross-platform runtime environment for developing server-side and networking applications.
    * csv-writer - npm package that convert objects/arrays into a CSV string or write them into a file



## Steps to complete challenge
    * Get the text file , and convert it to a string
    * Get all words in the string.
    * Store each word in an array, as a object with a key for the word, and a key for the words index in the string, that will be used as a way to know what section in the string the word is located.
  