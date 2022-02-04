document.addEventListener("DOMContentLoaded", () => {
  let guessedWords;
  let availableSpace;
  let word;
  let words = [];
  let guessedWordCount;
  let disabled;
  let streak = 0;
  let alltime = 0;
  let correct = [];
  let almost = [];

  var modal = document.getElementById("exampleModal");
  var span = document.getElementsByClassName("close")[0];
  var stats = document.getElementById("stats");
  var twitter = document.getElementById("twitter");
  var play = document.getElementById("play-again");
  var foot = document.getElementById("foot");
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

  twitter.onclick = function () {
    window.open("https://twitter.com/rillotv", "_blank");
  };
  youtube.onclick = function () {
    window.open("https://youtube.com/c/rillotv", "_blank");
  };

  stats.onclick = function () {
    modal.style.display = "block";
  };

  span.onclick = function() {
    modal.style.display = "none";
  }

  alltime = JSON.parse(localStorage.getItem("alltime")) || 0;

  const getRepeatedChars = (str) => {
    const chars = {};
    for (const char of str) {
      chars[char] = (chars[char] || 0) + 1;
    }
    return Object.entries(chars)
      .filter((char) => char[1] > 1)
      .map((char) => char[0]);
  };

  function addValue() {
    localStorage.setItem("alltime", alltime);
    localStorage.setItem("streak", streak);
    alltime = localStorage.getItem("alltime");
    streak = localStorage.getItem("streak");
  }

  function storeData() {
    if (typeof Storage !== "undefined") {
      // Store
      window.localStorage.setItem("alltime", alltime);
      // Retrieve
      alltime = localStorage.getItem("alltime");
    } else {
      console.log("Sorry, your browser does not support Web Storage...");
    }
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
    getData();
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

  function checkDuplicate(word, guess, dupes) {
    const currentWordArr = getCurrentWordArr();

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
    return tile;
  }

  function css(element, style) {
    for (const property in style) element.style[property] = style[property];
  }

  function handleSubmitWord() {
    const currentWordArr = getCurrentWordArr();

    if (currentWordArr.length !== 5) {
    }

    const currentWord = currentWordArr.join("");
    let dupes = getRepeatedChars(currentWord);
    let wordDupe = getRepeatedChars(word);
    let check = checkDuplicate(word, currentWord, wordDupe);

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
        currentWordArr.forEach((letter, index) => {
          setTimeout(() => {
            const tileColor = getTileColor(letter, index, check);

            const letterId = firstLetterId + index;
            const letterEl = document.getElementById(letterId);
            const key = letterEl.textContent;
            if (tileColor == "absent") {
              letterEl.setAttribute("data-state", "absent");
              document.getElementById(key).style =
                "background-color: var(--color-absent); color: white;";
            }
            if (tileColor == "correct") {
              letterEl.setAttribute("data-state", "correct");
              document.getElementById(key).style =
                "background-color: var(--color-correct); color: white;";
            }
            if (tileColor == "present") {
              letterEl.setAttribute("data-state", "present");
              document.getElementById(key).style =
                "background-color: var(--color-present); color: white;";
            }

            if (tileColor == "partial") {
              letterEl.setAttribute("data-state", "present");
              document.getElementById(key).style =
                "background: linear-gradient(.5turn, var(--color-correct) 50%, var(--color-present) 50%); color: white;";
            }

            letterEl.setAttribute("data-animation", "flip-in");
            letterEl.setAttribute("data-animation", "flip-out");
          }, interval * index);
        });
      }
    }

    guessedWordCount += 1;

    if (currentWord === word) {
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
    }

    //FINAL WRONG WORD
    if (guessedWords.length === 6) {
      const firstLetterId = 5 * 5 + 1;
      streak = 0;
      reveal = word.split("");

      //initial error play
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

  function getData() {
    //this will read file and send information to other function
    fetch("food.txt")
      .then((response) => response.text())
      .then((data) => {
        words = data.split(",");
        words = words.map((element) => {
          return element.toLowerCase();
        });
        getNewWord();
      });
  }
});
