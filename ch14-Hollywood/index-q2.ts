const fs = require("fs");

class WordFrequencyFramework {
    loadEventHandler = [];
    doworkEventHandler = [];
    endEventHandler = [];
    registerForLoadEvent(handler): void {
        this.loadEventHandler.push(handler);
    }
    registerForDoworkEvent(handler): void {
        this.doworkEventHandler.push(handler);
    }
    registerForEndEvent(handler): void {
        this.endEventHandler.push(handler);
    }
    run(pathToFile: string): void {
        for (let h of this.loadEventHandler) {
            h(pathToFile);
        }
        for (let h of this.doworkEventHandler) {
            h();
        }
        for (let h of this.endEventHandler) {
            h();
        }
    }
}

class DataStorage {
    data: string;
    stopWordFilter: StopWordFilter;
    wordEventHandlers = [];
    constructor(frameWork: WordFrequencyFramework, stopWordFilter: StopWordFilter) {
        this.stopWordFilter = stopWordFilter;
        frameWork.registerForLoadEvent(this.load.bind(this));
        frameWork.registerForDoworkEvent(this.produceWords.bind(this));
    }
    load(pathToFile: string): void {
        this.data = fs.readFileSync(pathToFile, 'utf8').toLowerCase().replace(/[\W_]+/g, ' ');
    }
    produceWords(): void {
        this.data.split(' ').forEach(word => {
            if (!this.stopWordFilter.isStopWord(word)) {
                for (let h of this.wordEventHandlers) h(word);
            }
        });
    }
    registerForWordEvent(handler): void {
        this.wordEventHandlers.push(handler);
    }
}

class StopWordFilter {
    stopWords: string[];
    constructor(framework: WordFrequencyFramework) {
        framework.registerForLoadEvent(this.load.bind(this))
    }
    load() {
        this.stopWords = fs.readFileSync("./files/stop_words.txt").toString().split(",");
    }
    isStopWord(word: string) {
        return this.stopWords.includes(word) || word.length < 2;
    }
}

class WordFrequencyCounter {
    sortedData = [];
    wordFrequancies = [];
    constructor(framework: WordFrequencyFramework, dataStorage: DataStorage) {
        dataStorage.registerForWordEvent(this.incrementCount.bind(this));
        framework.registerForEndEvent(this.sortAndPrint.bind(this))
    }
    incrementCount(word: string) {
        if (this.wordFrequancies[word])
            this.wordFrequancies[word]++;
        else
            this.wordFrequancies[word] = 1;
    }
    sortAndPrint() {
        for (let i in this.wordFrequancies) {
            this.sortedData.push(`${i} , ${this.wordFrequancies[i]}`);
        }
        this.sortedData.sort((a, b) => b.split(',')[1] - a.split(',')[1]);
        console.log(this.sortedData.slice(0, 25));
    }
}

class WordsWithZ {
    wordFrequencyCounter: WordFrequencyCounter;
    counterZletter: number = 0;
    constructor(framework: WordFrequencyFramework, wordFrequencyCounter: WordFrequencyCounter) {
        this.wordFrequencyCounter = wordFrequencyCounter;
        framework.registerForEndEvent(this.printWordsWithZ.bind(this));
    }
    printWordsWithZ() {
        this.wordFrequencyCounter.sortedData.forEach(item => {
            if (item.split(',')[0].includes('z')) {
                this.counterZletter += item.split(',')[1];
            }
        });
        console.log(`The counter of words contain z is: ${this.counterZletter}`
        );
    }
}

let wordFreuencyFramework = new WordFrequencyFramework();
let stopWordFilter = new StopWordFilter(wordFreuencyFramework);
let dataStorage = new DataStorage(wordFreuencyFramework, stopWordFilter);
let wordFrequencyCounter = new WordFrequencyCounter(wordFreuencyFramework, dataStorage);
const wordsWithZ = new WordsWithZ(wordFreuencyFramework, wordFrequencyCounter);
wordFreuencyFramework.run("./files/inputFile.txt");
