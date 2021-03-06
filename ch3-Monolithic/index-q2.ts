const fs = require("fs"); //
let word_freqs = [];
let stop_words = fs.readFileSync("./files/stop_words.txt", "utf8").split(",");
let start_char;
let i: number;
let found: boolean;
let word: string = '';
let pair_index: number = 0;
let temp = [];

let inputfile = fs.readFileSync("./files/inputFile.txt", "utf8").split('\r\n')
for (let j = 0; j < inputfile.length; j++) {
    start_char = null;// start_char index
    i = 0; // last char index
    for (let c = 0; c < inputfile[j].length; c++) {
        if (start_char == null) {
            if (inputfile[j][c].match(/^([a-zA-Z0-9])$/)) {
                start_char = i;
            }
        }
        else
            if (!inputfile[j][c].match(/^([a-zA-Z0-9])$/)) {
                //we reach the end of the word 
                found = false;
                word = inputfile[j].slice(start_char, i).toLowerCase().trim();
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
}
for (let i = 0; i < 25; i++) {
    console.log(word_freqs[i])
} 