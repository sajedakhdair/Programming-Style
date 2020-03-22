const fs = require("fs");

class TFExercise {
    constructor() {
    }
    info() {
        return this.constructor.name;
    }
}

class DataStorageManager extends TFExercise {
    data: string;
    constructor(filePath: string) {
        super();
        this.data = fs.readFileSync(filePath, 'utf8').toLowerCase().replace(/[\W_]+/g, " ");
    }
    words() {
        return this.data.split(" ");
    }
    info() {
        return super.info() + ": My major data structure is a " + this.data.constructor.name;
    }
}

class StopWordsManager extends TFExercise {
    stopWords: string[];
    constructor() {
        super();
        this.stopWords = require('fs').readFileSync("./files/stop_words.txt").toString().split(",");
    }
    isStopWord(word: string) {
        return this.stopWords.includes(word) || word.length < 2;
    }
    info() {
        return super.info() + ": My major data structure is a " + this.stopWords.constructor.name;
    }
}

class WordFrequencyManager extends TFExercise {
    wordFrequancies;
    sortedData = [];
    constructor() {
        super();
        this.wordFrequancies = {};
    }
    incrementCount(word: string) {
        if (this.wordFrequancies[word])
            this.wordFrequancies[word]++;
        else
            this.wordFrequancies[word] = 1;
    }
    sort() {
        for (let i in this.wordFrequancies) {
            this.sortedData.push(`${i} , ${this.wordFrequancies[i]}`);
        }
        this.sortedData.sort((a, b) => b.split(',')[1] - a.split(',')[1]);
        return this.sortedData.slice(0, 25);
    }
    info() {
        return super.info() + ": My major data structure is a " + this.sortedData.constructor.name;
    }
}

class WordFrequencyController extends TFExercise {
    storageManager: DataStorageManager;
    stopWordManager: StopWordsManager;
    wordFrequencyManager: WordFrequencyManager;
    constructor(path: string) {
        super();
        this.storageManager = new DataStorageManager(path);
        this.stopWordManager = new StopWordsManager();
        this.wordFrequencyManager = new WordFrequencyManager();
    }
    run() {
        this.storageManager.words().forEach(word => {
            if (!this.stopWordManager.isStopWord(word))
                this.wordFrequencyManager.incrementCount(word)
        });
        console.log(this.wordFrequencyManager.sort());
    }
}

new WordFrequencyController("./files/inputFile.txt").run();
