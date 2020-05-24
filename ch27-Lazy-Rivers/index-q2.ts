const fs = require("fs");
const lineReader = require("line-reader");

function* lines(filePath: string) {
    let words = fs.readFileSync(filePath, "utf8").split("\n");
    for (let line in words)
        yield words[line].replace(/[\W_]+/g, ' ').toLocaleLowerCase();
}

function* allWords(filPath: string) {
    for (let line of lines(filPath)) {
        for (let word of line.split(" "))
            yield word;
    }
}

function* nonStopWords(path: string) {
    let stopWords = fs.readFileSync("./files/stop_words.txt", "utf8").split(",");
    for (let word of allWords(path)) {
        if (!stopWords.includes(word) && word.length > 2) {
            yield word;
        }
    }
}

function* countAndSort(path: string) {
    let frequencies = {};
    let sortedArray = [];
    for (let word of nonStopWords(path)) {
        if (frequencies[word]) {
            frequencies[word]++;
        } else {
            frequencies[word] = 1;
        }
    }
    for (let i in frequencies) {
        sortedArray.push(`${i} , ${frequencies[i]}`);
    }
    sortedArray.sort(
        (a, b) => (b.split(',')[1]) - (a.split(',')[1])
    );
    yield sortedArray.slice(0, 25);
}

let sortedArray = countAndSort("./files/inputFile.txt");
console.log(sortedArray.next().value);

