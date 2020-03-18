const wrap = (v) => {
    return v;
}
const bind = (v, func) => {
    return func(v);
}
// Takes a path to a file and returns the entire contents of the file as a string
const fs = require("fs");
function readFile(filePath: string): string {
    return fs.readFileSync(filePath, "utf8");
}
// Takes a string and returns a copy with all nonalphanumeric chars replaced by white space
function filterCharsAndNormalize(data: string): string {
    let filteredData: string = "";
    for (let i = 0; i < data.length; i++) {
        if (!data[i].match(/^([a-zA-Z0-9])$/)) {
            filteredData += " ";
        } else
            filteredData += data[i].toLocaleLowerCase();
    }
    return filteredData;
}
// Takes a string and scans for words, returning  a list of words.
function scan(data: string): string[] {
    return data.split(" ");
}
// Takes a list of words and returns a copy with all stop words removed
function removeStopWords(data: string[]): string[] {
    let stopWords: string[] = fs.readFileSync("./files/stop_words.txt", "utf8").split(",");
    return data.filter(word => {
        return (!stopWords.includes(word) && word.length > 2);
    });
}
// Takes a list of words and returns a dictionary associating words with frequencies of occurrence
function frequancies(data: string[]): any[] {
    let wordFrequancies: any[] = [];
    data.forEach(word => {
        if (wordFrequancies[word]) {
            wordFrequancies[word]++;
        } else {
            wordFrequancies[word] = 1;
        }
    });
    return wordFrequancies;
}
/* Takes a dictionary of words and their frequencies and returns a list of pairs
   where the entries are sorted by frequency */
function sort(wordFrequancies: any[]): any[] {
    let sortedData = [];
    for (let i in wordFrequancies) {
        sortedData.push(`${i} , ${wordFrequancies[i]}`);
    }
    sortedData.sort((a, b) => b.split(',')[1] - a.split(',')[1]);
    return sortedData.slice(0, 25);
}
// Takes a list of pairs where the entries are sorted by frequency and print them recursively.
function printme(sortedData) {
    console.log(sortedData);
}
function main() {
    let readFileData = bind(wrap("./files/inputFile.txt"), readFile);
    let filterCharsData = bind(wrap(readFileData), filterCharsAndNormalize);
    let scanData = bind(wrap(filterCharsData), scan);
    let dataWithoutStopWords = bind(wrap(scanData), removeStopWords)
    let frequanciesData = bind(wrap(dataWithoutStopWords), frequancies);
    let sortedData = bind(wrap(frequanciesData), sort);
    printme(sortedData);
}
main();