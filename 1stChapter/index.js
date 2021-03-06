var fs = require("fs"); //used to open files
var lineReader = require("line-reader"); //
var data = []; //primary memory //let data: any = [];
//initilzation 
data.push(fs.readFileSync("./files/stop_words.txt", "utf8").split(",")); // data[0] holds the stop words
data.push(""); // data[1] is line (max 80 characters)
data.push(null); //data[2] is index of the start_char of word
data.push(0); //data[3] is index on characters, i = 0
data.push(false); //data[4] is flag indicating if word was found
data.push(""); //data[5] is the word
data.push(""); //data[6] is word,NNNN
data.push(0); // data[7] is frequency
data.push(""); //data[8] is index
data.push([]); //data[9] is array contains word_freq
lineReader.eachLine("./files/inputFile.txt", function (line, last) {
    data[1] = line;
    if (data[1][data[1].length - 1] != "\n") {
        data[1] = data[1] + "\n";
    }
    data[2] = null; //data[2] is index of the start_char of word
    data[3] = 0; //data[3] is index on characters, i = 0
    for (data[3] = 0; data[3] < data[1].length; data[3]++) {
        if (data[2] === null) {
            if (data[1][data[3]].match(/^([a-zA-Z0-9])$/)) {
                data[2] = data[3];
            }
        }
        else {
            if (!data[1][data[3]].match(/^([a-zA-Z0-9])$/)) {
                data[4] = false;
                data[5] = data[1].slice(data[2], data[3]).toLowerCase(); //the word 
                //check the length of word and if it's stop word
                if (data[5].length >= 2 && data[0].includes(data[5].trim()) == false) {
                    //word isn't stop word
                    for (data[8] = 0; data[8] < data[9].length; data[8]++) {
                        data[7] = Number(data[9][data[8]].split(",")[1]); //frequency
                        data[6] = data[9][data[8]].split(",")[0]; //the word
                        if (data[5].trim() === data[6].trim()) {
                            data[7]++;
                            data[4] = true;
                            data[9][data[8]] = data[5] + " ," + data[7].toString();
                            break;
                        }
                    }
                    if (data[4] == false) {
                        data[9].push(data[5] + " ,1");
                    }
                }
                data[2] = null;
            }
        }
    }
    if (last) {
        fs.writeFileSync("./1stChapter/word_freqs.txt", '', 'utf8');
        for (data[8] = 0; data[8] < data[9].length; data[8]++) {
            fs.appendFile("./1stChapter/word_freqs.txt", data[9][data[8]] + " \n", function (err) {
                if (err) {
                    console.error(err);
                }
            });
        }
        /*//here part 2 if i can do it by this way
        data[9].sort((a: string, b: string) => {
            return Number(b.split(",")[1]) - Number(a.split(",")[1]);
        });
        console.log(data[9]);here data[9] contains the word sorted according to the frequency
        */
        part2();
    }
});
function part2() {
    for (data[0] = 0; data[0] < 25; data[0]++) {
        data[data[0]] = '';
    }
    data[0] = '';
    data[25] = ''; //word,freq
    data[26] = 0; //freq 
    lineReader.eachLine('./1stChapter/word_freqs.txt', function (line, last) {
        data[25] = line;
        data[26] = Number(data[25].split(',')[1]);
        data[25] = data[25].split(',')[0];
        for (data[27] = 0; data[27] < 25; data[27]++) {
            if (data[data[27]] == '' || Number(data[data[27]].split(',')[1]) < data[26]) {
                data[data[27]] = data[25] + "," + data[26];
                break;
            }
        }
        if (last) {
            for (data[28] = 0; data[28] < 25; data[28]++) {
                console.log("sortedData" + data[data[28]]);
            }
        }
    });
}
