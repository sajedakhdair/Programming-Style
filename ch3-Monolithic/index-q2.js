var fs = require("fs"); //
var word_freqs = [];
var stop_words = fs.readFileSync("./files/stop_words.txt", "utf8").split(",");
var start_char;
var i;
var found;
var word = '';
var pair_index = 0;
var temp = [];
var inputfile = fs.readFileSync("./files/inputFile.txt", "utf8").split('\r\n');
for (var j = 0; j < inputfile.length; j++) {
    start_char = null; // start_char index
    i = 0; // last char index
    for (var c = 0; c < inputfile[j].length; c++) {
        if (start_char == null) {
            if (inputfile[j][c].match(/^([a-zA-Z0-9])$/)) {
                start_char = i;
            }
        }
        else if (!inputfile[j][c].match(/^([a-zA-Z0-9])$/)) {
            //we reach the end of the word 
            found = false;
            word = inputfile[j].slice(start_char, i).toLowerCase().trim();
            if (word.trim().length > 2 && stop_words.includes(word.trim()) == false) {
                //the word not from stop_words 
                pair_index = 0;
                for (var j_1 = 0; j_1 < word_freqs.length; j_1++) {
                    if (word == word_freqs[j_1][0].trim()) {
                        word_freqs[j_1][1]++; //frequency
                        found = true;
                        break;
                    }
                    pair_index++;
                }
                if (!found) {
                    word_freqs.push([word, 1]);
                }
                else if (word_freqs.length > 1) {
                    for (var j_2 = pair_index; j_2 >= 0; j_2--) {
                        if (word_freqs[pair_index][1] > word_freqs[j_2][1]) {
                            //swap
                            temp = word_freqs[j_2];
                            word_freqs[j_2] = word_freqs[pair_index];
                            word_freqs[pair_index] = temp;
                            pair_index = j_2;
                        }
                    }
                }
            }
            start_char = null;
        }
        i++;
    }
}
for (var i_1 = 0; i_1 < 25; i_1++) {
    console.log(word_freqs[i_1]);
}
