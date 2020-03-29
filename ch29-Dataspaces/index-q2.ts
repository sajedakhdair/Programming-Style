const fs = require("fs")
const { Queue } = require('queue-typescript')

let wordSpace = new Queue()
let freqSpace = new Queue();
let mergeSpace = new Queue();
let stopWords = fs.readFileSync("./files/stop_words.txt", 'utf8').split(",");
let workers = [];
let workers2 = [];
let wordFreq = {};

function processWord(resolve) {
    let wordFreq = {};
    let word;
    let id = setInterval(() => {
        if (wordSpace.length !== 0) {
            word = wordSpace.dequeue()
            if (!stopWords.includes(word) && word.length > 2) {
                if (wordFreq[word])
                    wordFreq[word]++;
                else wordFreq[word] = 1
            }
        }
        else {
            freqSpace.enqueue(wordFreq);
            resolve();
            clearInterval(id);
        }
    }, 1)
}

function mergeFrequencies(resolve) {
    let id = setInterval(() => {
        let freqs;
        let count = 0;
        if (freqSpace.length !== 0) {
            freqs = freqSpace.dequeue();
            Object.keys(freqs).forEach((word) => {
                if (wordFreq[word])
                    count = wordFreq[word] + freqs[word];
                else
                    count = freqs[word];
                wordFreq[word] = count
            })
        }
        else {
            resolve();
            clearInterval(id);
        }
    }, 1)
}

function createThreads() {
    let words = fs.readFileSync("./files/inputFile.txt", "utf8").
        toLowerCase().replace(/[\W_]+/g, " ").split(" ");

    for (let i = 0; i < words.length; i++) {
        wordSpace.enqueue(words[i])
    }
    for (let i = 1; i <= 5; i++) {
        workers.push(new Promise(function (resolve, reject) {
            processWord(resolve)
        }))
    }
}

async function main() {
    createThreads();
    await Promise.all(workers);

    for (let i = 1; i <= 5; i++) {
        workers2.push(new Promise(function (resolve, reject) {
            mergeFrequencies(resolve)
        }))
    }

    await Promise.all(workers2);

    let sortedArray = [];
    for (let i in wordFreq) {
        sortedArray.push(`${i} , ${wordFreq[i]}`);
    }
    sortedArray = sortedArray.sort(
        (a, b) => Number(b.split(',')[1]) - Number(a.split(',')[1])
    );
    console.log(sortedArray.slice(0, 25));
}
main();