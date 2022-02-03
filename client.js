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
      document.getElementById(letter).style="background-color: rgb(255, 255, 255); color: rgb(64 102 94);"
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
      availableSpaceEl.setAttribute("data-animation", "pop");

      availableSpaceEl.setAttribute("data-state", "tbd");

      availableSpace = availableSpace + 1;
      availableSpaceEl.innerText = letter;

      setTimeout(() => {
      availableSpaceEl.setAttribute("data-animation", "idle");
        
        }, 100);
    }
  }

  function checkDuplicate(word, guess, dupes){
      const currentWordArr = getCurrentWordArr();
      correct = [];
      almost = [];

      console.log(word);
      console.log(guess);
      console.log(dupes);
      
      currentWordArr.forEach((letter, index) => {
        if(word.charAt(index) === letter){
          correct.push({
            letter : letter,
            index : index
          });
        }
        if(word.charAt(index) != letter && dupes.includes(letter)){
          almost.push({
            letter : letter,
            index : index
          })
        }
      })
      console.log(correct);
      console.log(almost);
  }

  function getTileColor(letter, index, dupes) {
    let x;
    if(almost.length > 0){
      almost.forEach((check) => {
        if (check.letter === letter && check.index === index) {
          x = "partial";
        } else {
          const isCorrectLetter = word.includes(letter);
          if (!isCorrectLetter) {
            x = "rgb(58, 58, 60)";
          }
          const letterInThatPosition = word.charAt(index);
          const isCorrectPosition = letter === letterInThatPosition;
          if (isCorrectPosition) {
            x = "rgb(83, 141, 78)";
          }

          x = "rgb(181, 159, 59)"
        }
      });
    }
    else {
      const isCorrectLetter = word.includes(letter);
      if (!isCorrectLetter) {
        x = "rgb(58, 58, 60)";
      }
      const letterInThatPosition = word.charAt(index);
      const isCorrectPosition = letter === letterInThatPosition;
      if (isCorrectPosition) {
        x = "rgb(83, 141, 78)";
      }
    }
    
    return x;
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
      if(currentWord === word){
        currentWordArr.forEach((letter, index) => {
          setTimeout(() => {
            const tileColor = getTileColor(letter, index);
  
            const letterId = firstLetterId + index;
            const letterEl = document.getElementById(letterId);
            const key = letterEl.textContent;
            if(tileColor == "rgb(83, 141, 78)") letterEl.setAttribute("data-state", "correct");
  
           letterEl.setAttribute("data-animation", "flip-in")
           letterEl.setAttribute("data-animation", "flip-out")
           setTimeout(() => {
            letterEl.setAttribute("data-animation", "idle");
            letterEl.setAttribute("data-animation", "win")
          }, 800);
          }, interval * index);
        });
      }
      else{
        const getRepeatedChars = (str) => {
          const chars = {};
           for (const char of str) {
               chars[char] = (chars[char] || 0) + 1;
           }
           return Object.entries(chars).filter(char => char[1] > 1).map(char => char[0]);
       }
       
       let dupes = getRepeatedChars(word);
       checkDuplicate(word,currentWord, dupes);
        currentWordArr.forEach((letter, index) => {
          setTimeout(() => {
            const tileColor = getTileColor(letter, index, dupes);
  
            const letterId = firstLetterId + index;
            const letterEl = document.getElementById(letterId);
            const key = letterEl.textContent;
            if(tileColor == "rgb(58, 58, 60)") {
              letterEl.setAttribute("data-state", "absent");
              document.getElementById(key).style=("background-color: var(--color-absent); color: white;")
            }
            if(tileColor == "rgb(83, 141, 78)") {
              letterEl.setAttribute("data-state", "correct");
              document.getElementById(key).style=("background-color: var(--color-correct); color: white;")
            }
            if(tileColor == "rgb(181, 159, 59)") {
              letterEl.setAttribute("data-state", "present");
              document.getElementById(key).style=("background-color: var(--color-present); color: white;")
            }

            if(tileColor == "partial") {
              letterEl.setAttribute("data-state", "present");
              document.getElementById(key).style=("background: linear-gradient(.5turn, var(--color-correct) 50%, var(--color-present) 50%); color: white;")
            }

            // document.getElementById(key).style=("background: linear-gradient(.5turn, var(--color-correct) 50%, var(--color-present) 50%); color: white;")

           letterEl.setAttribute("data-animation", "flip-in")
           letterEl.setAttribute("data-animation", "flip-out")
          }, interval * index);
        });
      }
      
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

    //FINAL WRONG WORD
    if (guessedWords.length === 6) {
      const firstLetterId = 5 * 5 + 1;
      streak = 0; 
      reveal = word.split("");

      //initial error play
        currentWordArr.forEach((letter, index) => {
         setTimeout(() => {

          const tileColor = getTileColor(letter, index);

          const letterId = firstLetterId + index;
          const letterEl = document.getElementById(letterId);
          const key = letterEl.textContent;
          if(tileColor == "rgb(58, 58, 60)") letterEl.setAttribute("data-state", "absent");
          if(tileColor == "rgb(83, 141, 78)") letterEl.setAttribute("data-state", "correct");
          if(tileColor == "rgb(181, 159, 59)") letterEl.setAttribute("data-state", "present");

         letterEl.setAttribute("data-animation", "flip-in")
         letterEl.setAttribute("data-animation", "flip-out")
         setTimeout(() => {
         letterEl.setAttribute("data-animation", "invalid")
         },1500)

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
              letterEl.setAttribute("data-animation", "flip-in")
              letterEl.innerText = letter;
              letterEl.setAttribute("data-state", "correct");
              letterEl.setAttribute("data-animation", "flip-out")
              setTimeout(() => {
                letterEl.setAttribute("data-animation", "idle");
                letterEl.setAttribute("data-animation", "win")
              }, 800);
              },1000);
            }, interval * index);
            disabled = true;
        });
      },4000);
        },interval * index);
      });
      
      setTimeout(() => {
        document.getElementById("play").removeAttribute("hidden");
      }, 3000);
      
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
  document.getElementById("play").onclick = ({ target }) => {
    init();
  };

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
