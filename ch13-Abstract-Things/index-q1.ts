const fs = require("fs");

abstract class IDataStorage {
    abstract words();
}

abstract class IStopWordFilter {
    abstract isStopWord(word);
}

abstract class IWordFrequencyCounter {
    abstract incrementCount(word);
    abstract sort();
}

class DataStorageManager extends IDataStorage {
    data: string;
    constructor(filePath: string) {
        super();
        this.data = fs.readFileSync(filePath, 'utf8').toLowerCase().replace(/[\W_]+/g, " ");
    }
    words() {
        return this.data.split(" ");
    }
}

class StopWordsManager extends IStopWordFilter {
    stopWords: string[];
    constructor() {
        super();
        this.stopWords = fs.readFileSync("./files/stop_words.txt").toString().split(",");
    }
    isStopWord(word: string) {
        return this.stopWords.includes(word) || word.length < 2;
    }
}

class WordFrequencyManager extends IWordFrequencyCounter {
    sortedData: any[] = [];
    wordFrequancies;
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
}

class WordFrequencyController {
    storageManager: DataStorageManager;
    stopWordManager: StopWordsManager;
    wordFrequencyManager: WordFrequencyManager;

    constructor(path: string) {
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
