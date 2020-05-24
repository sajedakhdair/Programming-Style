const fs = require("fs");

function* characters(filePath: string) {
    let words = fs.readFileSync(filePath, "utf8").toLowerCase();
    for (let char of words) {
        yield char;
    }
}

function* allWords(filPath: string) {
    let startChar: boolean = true;
    let word: string = "";
    for (let char of characters(filPath)) {
        if (startChar) {
            if (char.match(/^([a-zA-Z0-9])$/)) {
                startChar = false;
                word = char;
            }
        } else {
            if (char.match(/^([a-zA-Z0-9])$/)) {
                word += char;
            } else {
                startChar = true;
                yield word;
            }
        }
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

