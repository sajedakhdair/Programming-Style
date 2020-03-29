const fs = require("fs");
class Info {
    info() {
        console.log(this.constructor.name)
    }
}

class DataStorageManager {
    data: string;
    information: Info = new Info();
    dispatch(message: string[]) {
        switch (message[0]) {
            case "init":
                return this.init(message[1]);
            case "words":
                return this.words();
            case "info":
                this.information.info.call(new DataStorageManager);
                break;
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
    information: Info = new Info();
    dispatch(message: string[]) {
        switch (message[0]) {
            case "init":
                return this.init();
            case "isStopWord":
                return this.isStopWord(message[1]);
            case "info":
                this.information.info.call(new StopWordsManager);
                break;
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
    information: Info = new Info();

    dispatch(message: string[]) {
        switch (message[0]) {
            case "incrementCount":
                return this.incrementCount(message[1]);
            case "sort":
                return this.sort();
            case "info":
                this.information.info.call(new WordFrequencyManager);
                break;
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
    information: Info = new Info();
    dispatch(message: string[]) {
        switch (message[0]) {
            case "init":
                return this.init(message[1]);
            case "run":
                return this.run();
            case "info":
                this.information.info.call(new WordFrequencyController);
                break;
            default:
                throw new Error(`Message not understood: ${message[0]} `);
        }
    }
    init(path: string) {
        this.storageManager = new DataStorageManager();
        this.storageManager.dispatch(['info']);
        this.stopWordManager = new StopWordsManager();
        this.stopWordManager.dispatch(['info']);
        this.wordFrequencyManager = new WordFrequencyManager();
        this.wordFrequencyManager.dispatch(['info']);
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
wordFrequencyController.dispatch(['info']);
wordFrequencyController.dispatch(['init', "./files/inputFile.txt"]);
wordFrequencyController.dispatch(['run']);
