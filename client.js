document.addEventListener("DOMContentLoaded", () => {
  let guessedWords;
  let availableSpace;
  let word;
  let words = [];
  let guessedWordCount;
  let disabled;
  let streak = 0;


  init();

  const keys = document.querySelectorAll(".keyboard-row button");

  function init() {
    document.getElementById('streak').innerHTML = "STREAK: " + streak;
    const alpha = Array.from(Array(26)).map((e, i) => i + 65);
    const alphabet = alpha.map((x) => String.fromCharCode(x).toLowerCase());
    alphabet.forEach(letter => {
      document.getElementById(letter).style="background-color: rgb(129, 131, 132)"
    });
    getData();
    guessedWords = [[]];
    availableSpace = 1;
    guessedWordCount = 0;
    document.getElementById("play").setAttribute("hidden", "true");
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

      availableSpace = availableSpace + 1;
      availableSpaceEl.textContent = letter;
    }
  }

  function getTileColor(letter, index) {
    const isCorrectLetter = word.includes(letter);

    if (!isCorrectLetter) {
      return "rgb(58, 58, 60)";
    }

    const letterInThatPosition = word.charAt(index);
    const isCorrectPosition = letter === letterInThatPosition;

    if (isCorrectPosition) {
      return "rgb(83, 141, 78)";
    }

    return "rgb(181, 159, 59)";
  }

  function css(element, style) {
    for (const property in style) element.style[property] = style[property];
  }

  function handleSubmitWord() {
    const currentWordArr = getCurrentWordArr();
    if (currentWordArr.length !== 5) {
    }

    const currentWord = currentWordArr.join("");

    if (!words.includes(currentWord)) {
      const firstLetterId = guessedWordCount * 5 + 1;
      currentWordArr.forEach((letter, index) => {
        setTimeout(() => {
          const letterId = firstLetterId + index;
          const letterEl = document.getElementById(letterId);

          letterEl.style.animation = `color_change .5s`;

          setTimeout(function () {
            letterEl.style = "initial";
          }, 500);
        });
      });
      document.getElementById("board-container").animate(
        [
          // keyframes
          { to: "border-color: red" },
          { transform: "translate(1px, 1px) rotate(0deg)" },
          { transform: "translate(-1px, -2px) rotate(-1deg)" },
          { transform: "translate(-3px, 0px) rotate(1deg)" },
          { transform: "translate(3px, 2px) rotate(0deg)" },
          { transform: "translate(1px, -1px) rotate(1deg)" },
          { transform: "translate(-1px, 2px) rotate(-1deg)" },
          { transform: "translate(-3px, 1px) rotate(0deg)" },
          { transform: "translate(3px, 1px) rotate(-1deg)" },
          { transform: "translate(-1px, -1px) rotate(1deg)" },
          { transform: "translate(1px, 2px) rotate(0deg)" },
          { transform: "translate(1px, -2px) rotate(-1deg)" },
        ],
        {
          // timing options
          duration: 500,
        }
      );

      throw Error("Word is not in our dictionary.");
    }

    const firstLetterId = guessedWordCount * 5 + 1;
    const interval = 200;
    if (guessedWords.length != 6) {
      currentWordArr.forEach((letter, index) => {
        setTimeout(() => {
          const tileColor = getTileColor(letter, index);

          const letterId = firstLetterId + index;
          const letterEl = document.getElementById(letterId);
          const key = letterEl.textContent;
          if(tileColor == "rgb(58, 58, 60)") document.getElementById(key).style="background-color: #191919"
          letterEl.classList.add("animate__flipInX");
          letterEl.style = `background-color:${tileColor};border-color:${tileColor}`;
        }, interval * index);
      });
    }

    guessedWordCount += 1;

    if (currentWord === word) {
      disabled = true;
      streak++;
      document.getElementById("play").removeAttribute("hidden");
    }

    if (guessedWords.length === 6) {
      const firstLetterId = 5 * 5 + 1;
      setTimeout(() => {
        for (let x = 0; x < 5; x++) {
          handleFinalDelete();
        }

        let reveal = word.split("");
        // reveal.forEach(letter => {
        // });

        reveal.forEach((letter, index) => {
          setTimeout(() => {
            updateGuessedWords(letter);
            const tileColor = getTileColor(letter, index);
            const letterId = firstLetterId + index;
            const letterEl = document.getElementById(letterId);
            letterEl.classList.add("animate__flipInX");
            letterEl.style = `background-color:${tileColor};border-color:${tileColor}`;
          }, interval * index);
        });
        disabled = true;
      }, 1000);
      setTimeout(() => {
        document.getElementById("play").removeAttribute("hidden");
      }, 3000);
      setTimeout(() => {
        currentWordArr.forEach((letter, index) => {
          setTimeout(() => {
            const letterId = firstLetterId + index;
            const letterEl = document.getElementById(letterId);

            letterEl.style.animation = `color_change .5s`;

            setTimeout(function () {
              letterEl.style = "initial";
            }, 500);

            document.getElementById("board-container").animate(
              [
                // keyframes
                { to: "border-color: red" },
                { transform: "translate(1px, 1px) rotate(0deg)" },
                { transform: "translate(-1px, -2px) rotate(-1deg)" },
                { transform: "translate(-3px, 0px) rotate(1deg)" },
                { transform: "translate(3px, 2px) rotate(0deg)" },
                { transform: "translate(1px, -1px) rotate(1deg)" },
                { transform: "translate(-1px, 2px) rotate(-1deg)" },
                { transform: "translate(-3px, 1px) rotate(0deg)" },
                { transform: "translate(3px, 1px) rotate(-1deg)" },
                { transform: "translate(-1px, -1px) rotate(1deg)" },
                { transform: "translate(1px, 2px) rotate(0deg)" },
                { transform: "translate(1px, -2px) rotate(-1deg)" },
              ],
              {
                // timing options
                duration: 500,
              }
            );
          });
        });
      });
    }
    guessedWords.push([]);
  }

  function createSquares() {
    const gameBoard = document.getElementById("board");
    gameBoard.innerHTML = "";

    for (let index = 0; index < 30; index++) {
      let square = document.createElement("div");
      square.classList.add("square");
      square.classList.add("animate__animated");
      square.setAttribute("id", index + 1);
      gameBoard.appendChild(square);
    }
  }

  function handleDeleteLetter() {
    const currentWordArr = getCurrentWordArr();

    if (currentWordArr.length > 0) {
      const removedLetter = currentWordArr.pop();

      guessedWords[guessedWords.length - 1] = currentWordArr;

      const lastLetterEl = document.getElementById(String(availableSpace - 1));

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
  document.getElementById("play").onclick = ({ target }) => {
    init();
  };

  function getData() {
    //this will read file and send information to other function
    fetch("words.txt")
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
