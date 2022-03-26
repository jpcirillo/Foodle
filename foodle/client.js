document.addEventListener("DOMContentLoaded", () => {
  let guessedWords;
  let availableSpace;
  let word;
  let guessedWordCount;
  let disabled;
  let streak = 0;
  let alltime = 0;
  let keyboardColors = [];
  let letterCol = [];

  var help = document.getElementById("help");
  var helpModal = document.getElementById("helpModal");
  var span = document.getElementsByClassName("close")[0];
  var closeHelp = document.getElementsByClassName("closeHelp")[0];
  var stats = document.getElementById("stats");
  var play = document.getElementById("play-again");
  var foot = document.getElementById("foot");
  var bar = document.getElementById("bar");
  var modal = document.getElementById("myModal");
  var youtube = document.getElementById("youtube");


  document.getElementById("play-again").onclick = ({ target }) => {
    init();
  };

  window.onclick = function (event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  };

  // discord.onclick = function () {
  //   window.open("https://discord.gg/WxkwX4v", "_blank");
  // };
  stats.onclick = function () {
    modal.style.display = "block";
  };

  help.onclick = function () {
    helpModal.style.display = "block";
    createHelpSquares();
  };

  // twitch.onclick = function () {
  //   window.open("https://twitch.tv/rillo", "_blank");
  // };

  span.onclick = function() {
    modal.style.display = "none";
  }

  closeHelp.onclick = function() {
    helpModal.style.display = "none";
  }

  alltime = JSON.parse(localStorage.getItem("alltime")) || 0;
  streak = JSON.parse(localStorage.getItem("streak")) || 0;
  function addValue() {
    localStorage.setItem("alltime", alltime);
    localStorage.setItem("streak", streak);
    alltime = localStorage.getItem("alltime");
    streak = localStorage.getItem("streak");
  }

  init();

  const keys = document.querySelectorAll(".keyboard-row button");

  function init() {
    addValue();
    foot.style = "visibility : hidden";
    modal.style.display = "none";

    document.getElementById("streak").innerHTML = streak;
    document.getElementById("alltime").innerHTML = alltime;
    const alpha = Array.from(Array(26)).map((e, i) => i + 65);
    const alphabet = alpha.map((x) => String.fromCharCode(x).toLowerCase());
    alphabet.forEach((letter) => {
      document.getElementById(letter).style =
        "background-color: var(--key-bg); var(--key-text-color)";
    });
    getNewWord();
    guessedWords = [[]];
    availableSpace = 1;
    guessedWordCount = 0;
    disabled = false;
    createSquares();
  }

  function getNewWord() {
    word = words[Math.floor(Math.random() * words.length)];
  }

  function getCurrentWordArr() {
    const numberOfGuessedWords = guessedWords.length;
    return guessedWords[numberOfGuessedWords - 1];
  }

  function getFinalWordArr() {
    return guessedWords[6 - 1];
  }

  function updateGuessedWords(letter) {
    const currentWordArr = getCurrentWordArr();

    if (currentWordArr && currentWordArr.length < 5) {
      currentWordArr.push(letter);

      const availableSpaceEl = document.getElementById(String(availableSpace));
      availableSpaceEl.setAttribute("data-animation", "pop");

      availableSpaceEl.setAttribute("data-state", "tbd");

      availableSpace = availableSpace + 1;
      availableSpaceEl.innerText = letter;

      setTimeout(() => {
        availableSpaceEl.setAttribute("data-animation", "idle");
      }, 100);
    }
  }

  function checkDuplicate(word, guess) {
    const word1 = word;
    const word2 = guess;
    const result = [];
    const letters = {};

    for (const letter of word1) {
      if (!letters[letter]) {
        letters[letter] = 0;
      }
      letters[letter]++;
    }

    const lettersCount = word1.length;
    for (let i = 0; i < lettersCount; i++) {
      const letter1 = word1[i];
      const letter2 = word2[i];
      if (letter1 === letter2) {
        result[i] = "correct";
        letters[letter2]--;
      }
    }

    for (let i = 0; i < lettersCount; i++) {
      const letter1 = word1[i];
      const letter2 = word2[i];

      if (result[i]) {
        continue;
      }

      if (letters[letter2]) {
        result[i] = "present";
        letters[letter2]--;
      } else {
        result[i] = "absent";
      }
    }

    return result;
  }

  function getTileColor(letter, index, check) {
    let tile = check[index];
    keyboardColors.push({
      letter : letter,
      color : tile,
    });
    letterCol.push({
      letter : letter,
      index : index
    });

    return tile;
  }

  function updateKeyboard(firstLetterId){
    let present = [];
    let correct = [];

    keyboardColors.forEach(key => {
      if(key.color === "present"){
        present.push(key.letter);
      }
      else if(key.color === "correct"){
        correct.push(key.letter);
      }
    });

    letterCol.forEach(letter => {
      if(present.includes(letter.letter)) {
        const letterId = firstLetterId + letter.index;
        const letterEl = document.getElementById(letterId);
        const key = letterEl.textContent;
        document.getElementById(key).style =
        "background-color: var(--color-present); color: white;";

      }
      else if(correct.includes(letter.letter)) {
        const letterId = firstLetterId + letter.index;
        const letterEl = document.getElementById(letterId);
        const key = letterEl.textContent;

        document.getElementById(key).style =
        "background-color: var(--color-correct); color: white;";
      }
      else {
        const letterId = firstLetterId + letter.index;
        const letterEl = document.getElementById(letterId);
        const key = letterEl.textContent;
        document.getElementById(key).style =
        "background-color: var(--color-absent); color: white;";
      }
    });
  }

  function handleSubmitWord() {
    keyboardColors = [];
    const currentWordArr = getCurrentWordArr();

    if (currentWordArr.length !== 5) {
    }

    const currentWord = currentWordArr.join("");
    let check = checkDuplicate(word, currentWord);

    if (!words.includes(currentWord)) {
      const firstLetterId = guessedWordCount * 5 + 1;
      currentWordArr.forEach((letter, index) => {
        setTimeout(() => {
          const letterId = firstLetterId + index;
          const letterEl = document.getElementById(letterId);

          letterEl.setAttribute("data-animation", "invalid");

          setTimeout(function () {
            letterEl.setAttribute("data-animation", "idle");
          }, 600);
        });
      });

      throw Error("Word is not in our dictionary.");
    }

    const firstLetterId = guessedWordCount * 5 + 1;
    const interval = 200;
    if (guessedWords.length != 6) {
      if (currentWord === word) {
        currentWordArr.forEach((letter, index) => {
          setTimeout(() => {
            const tileColor = getTileColor(letter, index, check);

            const letterId = firstLetterId + index;
            const letterEl = document.getElementById(letterId);
            const key = letterEl.textContent;
            if (tileColor == "correct")
              letterEl.setAttribute("data-state", "correct");

            letterEl.setAttribute("data-animation", "flip-in");
            letterEl.setAttribute("data-animation", "flip-out");
            setTimeout(() => {
              letterEl.setAttribute("data-animation", "idle");
              letterEl.setAttribute("data-animation", "win");
            }, 800);
          }, interval * index);
        });
      } else {
        let includes = [];
        currentWordArr.forEach((letter, index) => {
          setTimeout(() => {
            const tileColor = getTileColor(letter, index, check);

            const letterId = firstLetterId + index;
            const letterEl = document.getElementById(letterId);
            const key = letterEl.textContent;
            if (tileColor == "absent") {
              letterEl.setAttribute("data-state", "absent");
            }
            if (tileColor == "correct") {
              letterEl.setAttribute("data-state", "correct");
            }
            if (tileColor == "present") {
                letterEl.setAttribute("data-state", "present");
            }

            if (tileColor == "partial") {
              letterEl.setAttribute("data-state", "present");
            }

            letterEl.setAttribute("data-animation", "flip-in");
            letterEl.setAttribute("data-animation", "flip-out");
          }, interval * index);
        });
        setTimeout(() => {
        updateKeyboard(firstLetterId);
        }, 1100);
      }
    }

    guessedWordCount += 1;

    if (currentWord === word) {
      disabled = true;
      streak++;
      if (streak > alltime) {
        alltime = streak;
        localStorage.setItem("alltime", alltime);
      }
      localStorage.setItem("streak", streak);
      document.getElementById("streak").innerHTML = streak;
      document.getElementById("alltime").innerHTML = alltime;
      setTimeout(() => {
        foot.style = "visibility : visible";
        bar.style = "visibility : visible";
        modal.style.display = "block";
      }, 3000);
    }

    //FINAL WRONG WORD
    if (guessedWords.length === 6) {
      const firstLetterId = 5 * 5 + 1;
      streak = 0;
      reveal = word.split("");

      //initial error play
      if (currentWord === word) {
        currentWordArr.forEach((letter, index) => {
          setTimeout(() => {
            const tileColor = getTileColor(letter, index, check);

            const letterId = firstLetterId + index;
            const letterEl = document.getElementById(letterId);
            const key = letterEl.textContent;
            if (tileColor == "correct")
              letterEl.setAttribute("data-state", "correct");

            letterEl.setAttribute("data-animation", "flip-in");
            letterEl.setAttribute("data-animation", "flip-out");
            setTimeout(() => {
              letterEl.setAttribute("data-animation", "idle");
              letterEl.setAttribute("data-animation", "win");
            }, 800);
          }, interval * index);
        });
        disabled = true;
      streak++;
      if (streak > alltime) {
        alltime = streak;
      }
      document.getElementById("streak").innerHTML = streak;
      document.getElementById("alltime").innerHTML = alltime;
      setTimeout(() => {
        foot.style = "visibility : visible";
        modal.style.display = "block";
      }, 3000);
      }else{
        currentWordArr.forEach((letter, index) => {
          setTimeout(() => {
            const tileColor = getTileColor(letter, index, check);
  
            const letterId = firstLetterId + index;
            const letterEl = document.getElementById(letterId);
            const key = letterEl.textContent;
            if (tileColor == "absent")
              letterEl.setAttribute("data-state", "absent");
            if (tileColor == "correct")
              letterEl.setAttribute("data-state", "correct");
            if (tileColor == "present")
              letterEl.setAttribute("data-state", "present");
  
            letterEl.setAttribute("data-animation", "flip-in");
            letterEl.setAttribute("data-animation", "flip-out");
            setTimeout(() => {
              letterEl.setAttribute("data-animation", "invalid");
            }, 1500);
  
            setTimeout(() => {
              for (let x = 0; x < 5; x++) {
                handleFinalDelete();
              }
              reveal.forEach((letter, index) => {
                setTimeout(() => {
                  // updateGuessedWords(letter);
                  const letterId = firstLetterId + index;
                  const letterEl = document.getElementById(letterId);
                  letterEl.setAttribute("data-animation", "idle");
                  letterEl.setAttribute("data-state", "empty");
  
                  setTimeout(() => {
                    letterEl.setAttribute("data-animation", "flip-in");
                    letterEl.innerText = letter;
                    letterEl.setAttribute("data-state", "correct");
                    letterEl.setAttribute("data-animation", "flip-out");
                    setTimeout(() => {
                      letterEl.setAttribute("data-animation", "idle");
                      letterEl.setAttribute("data-animation", "win");
                    }, 800);
                  }, 1000);
                }, interval * index);
                disabled = true;
              });
            }, 3500);
          }, interval * index);
        });
        setTimeout(() => {
          foot.style = "visibility : visible";
          modal.style.display = "block";
        }, 7300);
      }
    }
    guessedWords.push([]);
  }

  function createSquares() {
    const gameBoard = document.getElementById("board");
    gameBoard.innerHTML = "";

    for (let index = 0; index < 30; index++) {
      let square = document.createElement("div");
      square.classList.add("square");
      square.setAttribute("id", index + 1);
      square.setAttribute("data-animation", "idle");
      square.setAttribute("data-state", "empty");
      gameBoard.appendChild(square);
    }
  }

  function createHelpSquares() {
    const helpBoard = document.getElementById("correct-board");
    helpBoard.innerHTML = "";

    for (let index = 30; index < 35; index++) {
      let square = document.createElement("div");
      square.classList.add("square");
      square.setAttribute("id", index + 1);
      square.setAttribute("data-animation", "idle");
      square.setAttribute("data-state", "empty");
      helpBoard.appendChild(square);
    }

    const containsBoard = document.getElementById("contains-board");
    containsBoard.innerHTML = "";

    for (let index = 35; index < 40; index++) {
      let square = document.createElement("div");
      square.classList.add("square");
      square.setAttribute("id", index + 1);
      square.setAttribute("data-animation", "idle");
      square.setAttribute("data-state", "empty");
      containsBoard.appendChild(square);
    }

    const absentBoard = document.getElementById("absent-board");
    absentBoard.innerHTML = "";

    for (let index = 40; index < 45; index++) {
      let square = document.createElement("div");
      square.classList.add("square");
      square.setAttribute("id", index + 1);
      square.setAttribute("data-animation", "idle");
      square.setAttribute("data-state", "empty");
      absentBoard.appendChild(square);
    }

    let correctSpot = [['P',0,'correct'],['L',1,'absent'],['A',2,'absent'],['T',3,'absent'],['E',4,'absent']]
    const interval = 200;
    const firstLetterId = 5 * 6 + 1;

    correctSpot.forEach((arr, index) => {
      setTimeout(() => {
        const letterId = firstLetterId + index;
        const letterEl = document.getElementById(letterId);
        letterEl.textContent = arr[0];
        if (arr[2] == "absent") {
        }
        if (arr[2] == "correct") {
          letterEl.setAttribute("data-state", "correct");
        }
        if (arr[2] == "present") {
            letterEl.setAttribute("data-state", "present");
        }

        letterEl.setAttribute("data-animation", "flip-in");
        letterEl.setAttribute("data-animation", "flip-out");
      }, interval * arr[1]);
    });

    let containsSpot = [['W',0,'absent'],['A',1,'absent'],['T',2,'absent'],['E',3,'absent'],['R',4,'present']]
    const containsInterval = 200;
    const containsLetterId = 5 * 7 + 1;

    containsSpot.forEach((arr, index) => {
      setTimeout(() => {
        const letterId = containsLetterId + index;
        const letterEl = document.getElementById(letterId);
        letterEl.textContent = arr[0];
        if (arr[2] == "absent") {
        }
        if (arr[2] == "correct") {
          letterEl.setAttribute("data-state", "correct");
        }
        if (arr[2] == "present") {
            letterEl.setAttribute("data-state", "present");
        }

        letterEl.setAttribute("data-animation", "flip-in");
        letterEl.setAttribute("data-animation", "flip-out");
      }, containsInterval * arr[1]);
    });

    let absentSpot = [['B',0,'absent'],['A',1,'present'],['S',2,'present'],['I',3,'present'],['L',4,'present']]
    const absentInterval = 200;
    const absentLetterId = 5 * 8 + 1;

    absentSpot.forEach((arr, index) => {
      setTimeout(() => {
        const letterId = absentLetterId + index;
        const letterEl = document.getElementById(letterId);
        letterEl.textContent = arr[0];
        if (arr[2] == "absent") {
          letterEl.setAttribute("data-state", "absent");
        }
        if (arr[2] == "correct") {
        }
        if (arr[2] == "present") {
        }

        letterEl.setAttribute("data-animation", "flip-in");
        letterEl.setAttribute("data-animation", "flip-out");
      }, absentInterval * arr[1]);
    });


  }

  function handleDeleteLetter() {
    const currentWordArr = getCurrentWordArr();

    if (currentWordArr.length > 0) {
      const removedLetter = currentWordArr.pop();

      guessedWords[guessedWords.length - 1] = currentWordArr;

      const lastLetterEl = document.getElementById(String(availableSpace - 1));
      lastLetterEl.setAttribute("data-state", "empty");

      lastLetterEl.textContent = "";
      availableSpace = availableSpace - 1;
    }
  }

  function handleFinalDelete() {
    const currentWordArr = getFinalWordArr();

    if (currentWordArr.length > 0) {
      const removedLetter = currentWordArr.pop();

      guessedWords[guessedWords.length - 1] = currentWordArr;

      const lastLetterEl = document.getElementById(String(availableSpace - 1));
      lastLetterEl.setAttribute("data-state", "empty");

      lastLetterEl.textContent = "";
      availableSpace = availableSpace - 1;
    }
  }

  document.addEventListener(
    "keydown",
    (event) => {
      if (disabled === false) {
        const letter = event.key;

        if (event.keyCode >= 65 && event.keyCode <= 90) {
          updateGuessedWords(letter);
        }

        if (letter === "Enter") {
          handleSubmitWord();
          return;
        }

        if (letter === "Backspace") {
          handleDeleteLetter();
          return;
        }
      }
    },
    false
  );

  for (let i = 0; i < keys.length; i++) {
    keys[i].onclick = ({ target }) => {
      const letter = target.getAttribute("data-key");
      if (disabled === false) {
        if (letter === "enter") {
          handleSubmitWord();
          return;
        }

        if (letter === "del") {
          handleDeleteLetter();
          return;
        }
        updateGuessedWords(letter);
      }
    };
  }
});
