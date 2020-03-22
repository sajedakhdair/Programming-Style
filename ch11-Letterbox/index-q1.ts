const fs = require("fs");
class DataStorageManager {
    data: string;
    dispatch(message: string[]) {
        switch (message[0]) {
            case "init":
                return this.init(message[1]);
            case "words":
                return this.words();
            default:
                throw new Error(`Message not understood: ${message[0]}`);
        }
    }
    init(filePath: string) {
        this.data = fs.readFileSync(filePath, 'utf8').toLowerCase().replace(/[\W_]+/g, " ");
    }
    words() {
        return this.data.split(" ");
    }
}

class StopWordsManager {
    stopWords: string[];
    dispatch(message: string[]) {
        switch (message[0]) {
            case "init":
                return this.init();
            case "isStopWord":
                return this.isStopWord(message[1]);
            default:
                throw new Error(`Message not understood: ${message[0]} `);
        }
    }
    init() {
        this.stopWords = fs.readFileSync("./files/stop_words.txt").toString().split(",");
    }
    isStopWord(word: string) {
        return this.stopWords.includes(word) || word.length < 2;
    }
}

class WordFrequencyManager {
    sortedData = [];
    wordFrequancies = {};
    dispatch(message: string[]) {
        switch (message[0]) {
            case "incrementCount":
                return this.incrementCount(message[1]);
            case "sort":
                return this.sort();
            default:
                throw new Error(`Message not understood: ${message[0]} `);
        }
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
}

class WordFrequencyController {
    storageManager: DataStorageManager;
    stopWordManager: StopWordsManager;
    wordFrequencyManager: WordFrequencyManager;
    dispatch(message: string[]) {
        switch (message[0]) {
            case "init":
                return this.init(message[1]);
            case "run":
                return this.run();
            default:
                throw new Error(`Message not understood: ${message[0]} `);
        }
    }
    init(path: string) {
        this.storageManager = new DataStorageManager();
        this.stopWordManager = new StopWordsManager();
        this.wordFrequencyManager = new WordFrequencyManager();
        this.storageManager.dispatch(['init', path]);
        this.stopWordManager.dispatch(['init']);
    }
    run() {
        this.storageManager.words().forEach(word => {
            if (!this.stopWordManager.isStopWord(word))
                this.wordFrequencyManager.incrementCount(word)
        });
        console.log(this.wordFrequencyManager.sort());
    }
}

let wordFrequencyController = new WordFrequencyController();
wordFrequencyController.dispatch(['init', "./files/inputFile.txt"]);
wordFrequencyController.dispatch(['run']);
