const fs = require("fs");

class EventManager {
    subscriptions: {};
    constructor() {
        this.subscriptions = {};
    }
    subscribe(eventType: string, handler): void {
        if (this.subscriptions[eventType]) {
            this.subscriptions[eventType].push(handler);
        } else {
            this.subscriptions[eventType] = [handler];
        }
    }
    publish(event: string[]): void {
        const eventType = event[0];
        if (this.subscriptions[eventType]) {
            for (let handler of this.subscriptions[eventType]) {
                handler(event);
            }
        }
    }
}

class DataStorage {
    data: string;
    eventManager: EventManager;
    constructor(eventManager: EventManager) {
        this.eventManager = eventManager;
        this.eventManager.subscribe('load', this.load.bind(this));
        this.eventManager.subscribe('start', this.produceWords.bind(this));
    }
    load(event: string[]): void {
        const pathToFile = event[1];
        this.data = fs.readFileSync(pathToFile, 'utf8').toLowerCase().replace(/[\W_]+/g, ' ');
    }
    produceWords(): void {
        this.data.split(' ').forEach(word => {
            this.eventManager.publish(['word', word]);
        });
        this.eventManager.publish(["endOfFile", null]);
    }
}

class StopWordFilter {
    stopWords: string[];
    eventManager: EventManager;
    constructor(eventManager: EventManager) {
        this.stopWords = [];
        this.eventManager = eventManager;
        this.eventManager.subscribe('load', this.load.bind(this));
        this.eventManager.subscribe('word', this.isStopWord.bind(this));
    }
    load() {
        this.stopWords = fs.readFileSync("./files/stop_words.txt").toString().split(",");
    }
    isStopWord(event: string[]) {
        const word = event[1];

        if (!(this.stopWords.includes(word) || word.length < 2)) {
            this.eventManager.publish(['validWord', word]);

        }
    }
}

class WordFrequencyCounter {
    sortedData = [];
    wordFrequancies: {};
    eventManager: EventManager;
    constructor(eventManager: EventManager) {
        this.wordFrequancies = {}; this.eventManager = eventManager;
        this.eventManager.subscribe('validWord', this.incrementCount.bind(this));
        this.eventManager.subscribe('sortAndPrint', this.sortAndPrint.bind(this));
    }
    incrementCount(event: string[]) {
        const word = event[1];
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

class WordFrequencyApplication {
    eventManager: EventManager;
    constructor(eventManager: EventManager) {
        this.eventManager = eventManager;
        this.eventManager.subscribe('run', this.run.bind(this));
        this.eventManager.subscribe('endOfFile', this.stop.bind(this));
    }
    run(event: string[]): void {
        const pathToFile = event[1];
        this.eventManager.publish(['load', pathToFile]);
        this.eventManager.publish(['start', null]);
    }
    stop(): void {
        this.eventManager.publish(['sortAndPrint', null]);
        this.eventManager.publish(['printWordsWithZ', null]);
    }
}

class WordsWithZ {
    wordFrequencyCounter: WordFrequencyCounter;
    counterZletter: number = 0;
    eventManager: EventManager;

    constructor(eventManager: EventManager, wordFrequencyCounter: WordFrequencyCounter) {
        this.wordFrequencyCounter = wordFrequencyCounter;
        this.eventManager = eventManager;
        eventManager.subscribe('printWordsWithZ', this.printWordsWithZ.bind(this));
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

let eventManager = new EventManager();
let dataStorage = new DataStorage(eventManager);
let stopWordFilter = new StopWordFilter(eventManager);
let wordFrequencyCounter = new WordFrequencyCounter(eventManager);
let wordFrequencyApp = new WordFrequencyApplication(eventManager);
let wordsWithZ = new WordsWithZ(eventManager, wordFrequencyCounter);
eventManager.publish(["run", "./files/inputFile.txt"]);