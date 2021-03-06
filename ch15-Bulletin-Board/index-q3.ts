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

    unSubscribe(eventType: string, handler): void {
        if (this.subscriptions[eventType].includes(handler)) {
            for (let i = 0; i < this.subscriptions[eventType].length; i++) {
                if (this.subscriptions[eventType][i] == handler)
                    this.subscriptions[eventType].splice(i, 1)
                break;
            }
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
        this.eventManager.unSubscribe("load", this.load.bind(this));
    }
    produceWords(): void {
        this.data.split(' ').forEach(word => {
            this.eventManager.publish(['word', word]);
        });
        this.eventManager.publish(["endOfFile", null]);
        this.eventManager.unSubscribe('start', this.produceWords.bind(this))
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
        this.eventManager.unSubscribe("load", this.load.bind(this));
    }
    isStopWord(event: string[]) {
        const word = event[1];
        if (!(this.stopWords.includes(word) || word.length < 2)) {
            this.eventManager.publish(['validWord', word]);
            this.eventManager.unSubscribe('word', this.isStopWord.bind(this))
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
        if (word == 'unsubscribe') {
            this.eventManager.unSubscribe('valid_word');
        } else {
            if (this.wordFrequancies[word])
                this.wordFrequancies[word]++;
            else
                this.wordFrequancies[word] = 1;
        }
    }
    sortAndPrint() {
        for (let i in this.wordFrequancies) {
            this.sortedData.push(`${i} , ${this.wordFrequancies[i]}`);
        }
        this.sortedData.sort((a, b) => b.split(',')[1] - a.split(',')[1]);
        console.log(this.sortedData.slice(0, 25));
        this.eventManager.unSubscribe('sortAndPrint', this.sortAndPrint.bind(this))
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
        this.eventManager.unSubscribe('run', this.run.bind(this));

    }
    stop(): void {
        this.eventManager.publish(['sortAndPrint', null]);
        this.eventManager.unSubscribe('endOfFile', this.stop.bind(this));
    }
}

let eventManager = new EventManager();
let dataStorage = new DataStorage(eventManager);
let stopWordFilter = new StopWordFilter(eventManager);
let wordFrequencyCounter = new WordFrequencyCounter(eventManager);
let wordFrequencyApp = new WordFrequencyApplication(eventManager);
eventManager.publish(["run", "./files/inputFile.txt"]);