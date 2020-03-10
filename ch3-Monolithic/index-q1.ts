const fs = require("fs"); //
const lineReader = require("line-reader"); //
let word_freqs = [];
let stop_words = fs.readFileSync("./files/stop_words.txt", "utf8").split(",");
let start_char;
let i: number;
let found: boolean;
let word: string = '';
let pair_index: number = 0;
let temp = [];
lineReader.eachLine("./files/inputFile.txt", function (line, last) {
    start_char = null;// start_char index
    i = 0; // last char index
    for (let j = 0; j < line.length; j++) {
        if (start_char == null) {
            if (line[i].match(/^([a-zA-Z0-9])$/)) {
                start_char = i;
            }
        }
        else
            if (!line[i].match(/^([a-zA-Z0-9])$/)) {
                //we reach the end of the word 
                found = false;
                word = line.slice(start_char, i).toLowerCase().trim();
                if (word.trim().length > 2 && stop_words.includes(word.trim()) == false) {
                    //the word not from stop_words 
                    pair_index = 0;
                    for (let j = 0; j < word_freqs.length; j++) {
                        if (word == word_freqs[j][0].trim()) {
                            word_freqs[j][1]++; //frequency
                            found = true;
                            break;
                        }
                        pair_index++;
                    }
                    if (!found) {
                        word_freqs.push([word, 1])
                    }
                    else if (word_freqs.length > 1) {
                        for (let j = pair_index; j >= 0; j--) {
                            if (word_freqs[pair_index][1] > word_freqs[j][1]) {
                                //swap
                                temp = word_freqs[j];
                                word_freqs[j] = word_freqs[pair_index];
                                word_freqs[pair_index] = temp;
                                pair_index = j;
                            }
                        }
                    }
                }
                start_char = null;
            }
        i++;
    }
    if (last) {
        for (let i = 0; i < word_freqs.length && i < 25; i++) {
            console.log(word_freqs[i])
        }
    }
});
