const fs = require("fs");
const lineReader = require("line-reader");
let frequencies = {};

function lines(filePath: string) {
    let words = fs.readFileSync(filePath, "utf8").replace(/[\W_]+/g, ' ').toLocaleLowerCase()
        .split("\n");
    console.log(words)
    let iterator = words[Symbol.iterator]();
    let myIterator;
    while (true) {
        myIterator = iterator.next()
        if (!myIterator.done)
            allWords(myIterator.value);
        else
            break
    }
    sort();
}

function allWords(line: string) {
    let words = line.split(" ");
    let iterator = words[Symbol.iterator]();
    let myIterator;
    while (true) {
        myIterator = iterator.next()
        if (!myIterator.done)
            nonStopWords(myIterator.value);
        else
            break
    }
}

function nonStopWords(word: string) {
    let stopWords = fs.readFileSync("./files/stop_words.txt", "utf8").split(",");
    if (!stopWords.includes(word) && word.length > 2) {
        countAndSort(word);
    }
}

function countAndSort(word: string) {
    if (frequencies[word]) {
        frequencies[word]++;
    } else {
        frequencies[word] = 1;
    }
}
function sort() {
    let sortedArray = [];
    for (let i in frequencies) {
        sortedArray.push(`${i} , ${frequencies[i]}`);
    }
    sortedArray.sort(
        (a, b) => (b.split(',')[1]) - (a.split(',')[1])
    );
    console.log(sortedArray.slice(0, 25));
}

let sortedArray = lines("./files/inputFile.txt");

