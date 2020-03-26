const fs = require("fs");
const assert = require("assert");

const extractWords = (pathToFile: string): string[] => {
    if (typeof pathToFile != 'string' || !pathToFile) {
        throw new Error('I need a non-empty string!');
    }
    let wordList: string[];
    try {
        wordList = fs.readFileSync(pathToFile, 'utf8');
    } catch  {
        console.log("Error in opening the file");
        return [];
    }
    return wordList.toString().replace(/[\W_]+/g, ' ').toLowerCase().split(' ');;
};

const removeStopWords = (wordList: string[]): string[] => {
    if (!Array.isArray(wordList)) {
        throw new Error('I need a list!');
    }
    let stopWords: string[];
    try {
        stopWords = fs.readFileSync("./files/stop_words.txt", "utf8").split(",");
    } catch {
        console.log("Error in opening the file");
        return wordList;
    }
    return wordList.filter(word => {
        return (!stopWords.includes(word) && word.length > 2);
    });
}

const frequencies = (wordList: string[]): {} => {
    if (!Array.isArray(wordList)) throw new Error("word List should be an list");
    if (wordList.length === 0) throw new Error("word List shouldn't be an empty array");
    let wordFrequancies = [];
    wordList.forEach(word => {
        if (wordFrequancies[word]) {
            wordFrequancies[word]++;
        } else {
            wordFrequancies[word] = 1;
        }
    });
    return wordFrequancies;
}

const sort = (wordFrequancies): string[] => {
    if (typeof wordFrequancies != 'object') {
        throw new Error('wordFrequancies should be an {}');
    }
    if (Object.keys(wordFrequancies).length === 0) {
        throw new Error('I need a non-empty object');
    }
    let sortedData = [];
    for (let i in wordFrequancies) {
        sortedData.push(`${i} , ${wordFrequancies[i]}`);
    }
    sortedData.sort((a, b) => b.split(',')[1] - a.split(',')[1]);
    return sortedData;
}

//
try {
    const wordFrequancies: string[] = sort(
        frequencies(removeStopWords(extractWords("./files/inputFile.txt"))));
    if (!Array.isArray(wordFrequancies)) {
        throw new Error('OMG! This is not a list!');
    }
    console.log(wordFrequancies.slice(0, 25));
} catch (error) {
    console.error(`Something Wrong: ${error.toString}`);
} 