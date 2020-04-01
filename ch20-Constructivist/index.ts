const fs = require("fs");

const extractWords = (pathToFile: string): string[] => {
    let wordList: string[];
    if (typeof pathToFile != 'string' || !pathToFile) {
        return [];
    }
    try {
        wordList = fs.readFileSync(pathToFile, 'utf8');
    } catch (error) {
        console.log(`error when opening ${pathToFile}:,${error.toString()}`);
        return [];
    }
    return wordList.toString().replace(/[\W_]+/g, ' ').toLowerCase().split(' ');;
};

const removeStopWords = (wordList: string[]): string[] => {
    let stopWords: string[];
    if (!Array.isArray(wordList)) {
        return [];
    }
    try {
        stopWords = fs.readFileSync("./files/stop_words.txt", "utf8").split(",");
    } catch (error) {
        console.log('"error when opening ./files/stop_words.txt:', error.toString());
        return wordList;
    }
    return wordList.filter(word => {
        return (!stopWords.includes(word) && word.length > 2);
    });
}

const frequencies = (wordList: string[]): {} => {
    let wordFrequancies = [];;
    if (!Array.isArray(wordList) || wordList.length === 0) {
        return [];
    }
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
    if (typeof wordFrequancies !== "object") return [];
    let sortedData = [];
    for (let i in wordFrequancies) {
        sortedData.push(`${i} , ${wordFrequancies[i]}`);
    }
    sortedData.sort((a, b) => b.split(',')[1] - a.split(',')[1]);
    return sortedData
}

const wordFrequancies: string[] = sort(
    frequencies(removeStopWords(extractWords("./files/inputFile.txt")))
);

console.log(wordFrequancies.slice(0, 25));