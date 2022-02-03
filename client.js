document.addEventListener("DOMContentLoaded", () => {
  let guessedWords;
  let availableSpace;
  let word;
  let words = [];
  let guessedWordCount;
  let disabled;
  let streak = 0;
  let alltime = 0;
  var modal = document.getElementById("exampleModal");

  alltime = JSON.parse(localStorage.getItem('alltime')) || 0;


function addValue() {
  localStorage.setItem('alltime', alltime);
  localStorage.setItem('streak', streak);
  alltime = localStorage.getItem("alltime");
  streak = localStorage.getItem("streak");
  console.log(alltime);
}

function storeData() {
  if (typeof(Storage) !== "undefined") {
    // Store
    window.localStorage.setItem("alltime", alltime);
    // Retrieve
    console.log(localStorage.getItem("alltime"));
    alltime = localStorage.getItem("alltime");
  } else {
    console.log("Sorry, your browser does not support Web Storage...");
  }
}

  init();

  const keys = document.querySelectorAll(".keyboard-row button");

  function init() {
    // addValue();
    modal.style.display = "none";

    // document.getElementById('streak').innerHTML = "CURRENT STREAK: " + streak;
    // document.getElementById('alltime').innerHTML = "All TIME STREAK: " + alltime;
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
    console.log(word);
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
      console.log(availableSpaceEl);
      availableSpaceEl.setAttribute("data-animation", "pop");

      availableSpaceEl.setAttribute("data-state", "tbd");

      availableSpace = availableSpace + 1;
      availableSpaceEl.innerText = letter;

      setTimeout(() => {
      availableSpaceEl.setAttribute("data-animation", "idle");
        
        }, 100);
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

         // letterEl.style.animation = `color_change .5s`;
         // document.getElementById("row").setAttribute("data-animation", "invalid")

          setTimeout(function () {
            letterEl.style = "initial";
         //  document.getElementById("row").setAttribute("data-animation", "idle")

          }, 600);
        });
      });
      // document.getElementById("board-container").animate(
      //   [
      //     // keyframes
      //     { to: "border-color: red" },
      //     { transform: "translate(1px, 1px) rotate(0deg)" },
      //     { transform: "translate(-1px, -2px) rotate(-1deg)" },
      //     { transform: "translate(-3px, 0px) rotate(1deg)" },
      //     { transform: "translate(3px, 2px) rotate(0deg)" },
      //     { transform: "translate(1px, -1px) rotate(1deg)" },
      //     { transform: "translate(-1px, 2px) rotate(-1deg)" },
      //     { transform: "translate(-3px, 1px) rotate(0deg)" },
      //     { transform: "translate(3px, 1px) rotate(-1deg)" },
      //     { transform: "translate(-1px, -1px) rotate(1deg)" },
      //     { transform: "translate(1px, 2px) rotate(0deg)" },
      //     { transform: "translate(1px, -2px) rotate(-1deg)" },
      //   ],
      //   {
      //     // timing options
      //     duration: 500,
      //   }
      // );

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
          if(tileColor == "rgb(58, 58, 60)") letterEl.setAttribute("data-state", "absent");
          if(tileColor == "rgb(83, 141, 78)") letterEl.setAttribute("data-state", "correct");
          if(tileColor == "rgb(181, 159, 59)") letterEl.setAttribute("data-state", "present");
          // if(tileColor == "rgb(83, 141, 78)") document.getElementById(key).setAttribute("data-state", "correct");
         // letterEl.classList.add("animate__flipInX");
         letterEl.setAttribute("data-animation", "flip-in")
         // letterEl.style = `background-color:${tileColor};border-color:${tileColor}`;
         letterEl.setAttribute("data-animation", "flip-out")
        }, interval * index);
      });
    }

    guessedWordCount += 1;

    if (currentWord === word) {
      disabled = true;
      streak++;
      if(streak>alltime){
        alltime = streak;
      }
      document.getElementById("play").removeAttribute("hidden");
      var span = document.getElementsByClassName("close")[0];

      $('#exampleModal').modal('show');

      
      // When the user clicks anywhere outside of the modal, close it
      window.onclick = function(event) {
        if (event.target == modal) {
          modal.style.display = "none";
        }
      }
      document.getElementById('streak').innerHTML = "SESSION STREAK: " + streak;
      document.getElementById('alltime').innerHTML = "All TIME STREAK: " + alltime;
    }

    if (guessedWords.length === 6) {
      const firstLetterId = 5 * 5 + 1;
      streak = 0; 
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
            document.getElementById("row").setAttribute("data-animation", "invalid")
            // document.getElementById("board-container").animate(
            //   [
            //     // keyframes
            //     { to: "border-color: red" },
            //     { transform: "translate(1px, 1px) rotate(0deg)" },
            //     { transform: "translate(-1px, -2px) rotate(-1deg)" },
            //     { transform: "translate(-3px, 0px) rotate(1deg)" },
            //     { transform: "translate(3px, 2px) rotate(0deg)" },
            //     { transform: "translate(1px, -1px) rotate(1deg)" },
            //     { transform: "translate(-1px, 2px) rotate(-1deg)" },
            //     { transform: "translate(-3px, 1px) rotate(0deg)" },
            //     { transform: "translate(3px, 1px) rotate(-1deg)" },
            //     { transform: "translate(-1px, -1px) rotate(1deg)" },
            //     { transform: "translate(1px, 2px) rotate(0deg)" },
            //     { transform: "translate(1px, -2px) rotate(-1deg)" },
            //   ],
            //   {
            //     // timing options
            //     duration: 500,
            //   }
            // );
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
