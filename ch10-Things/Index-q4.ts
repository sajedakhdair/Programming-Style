const fs = require("fs");
let wordFrequancies = {};

const dataStorageManager = (filePath: string): string[] => {
    let words: string;
    words = fs.readFileSync(filePath, 'utf8').toLowerCase().replace(/[\W_]+/g, " ");
    return words.split(" ");
}

const notStopWordsManager = (word) => {
    let stopWords: string[];
    stopWords = require('fs').readFileSync("./files/stop_words.txt").toString().split(",");

    return (!stopWords.includes(word) && word.length > 2);
}

const wordFrequencyManager = (word) => {
    let sortedData = [];
    if (wordFrequancies[word]) {
        wordFrequancies[word]++;
    }
    else {
        wordFrequancies[word] = 1;
    }

    for (let i in wordFrequancies) {
        sortedData.push(`${i} , ${wordFrequancies[i]}`);
    }
    sortedData.sort((a, b) => b.split(',')[1] - a.split(',')[1]);
    return sortedData;
}
const main = () => {
    let data = dataStorageManager("./files/inputFile.txt");
    console.log(data);
    let sortedData = [];
    let word: string = '';
    data.forEach((word) => {
        if (notStopWordsManager(word))
            sortedData = wordFrequencyManager(word)
    });
    console.log(sortedData.slice(0, 25));
}
main();