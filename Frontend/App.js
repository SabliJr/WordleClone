const tileDisplay = document.querySelector(".tile_container");
const keyboard = document.querySelector(".keys_container");
const messageDisplay = document.querySelector(".message_container");

let wordle;

//Fetching the word
const getWordle = () => {
  fetch("https://wordleappclone.onrender.com/word")
    .then((response) => response.json())
    .then((json) => {
      // console.log(json);
      wordle = json.toUpperCase();
    })
    .catch((err) => {
      console.error(err);
    });
};

getWordle();

const keys = [
  "Q",
  "W",
  "E",
  "R",
  "T",
  "Y",
  "U",
  "I",
  "O",
  "P",
  "A",
  "S",
  "D",
  "F",
  "G",
  "H",
  "J",
  "K",
  "L",
  "ENTER",
  "Z",
  "X",
  "C",
  "V",
  "B",
  "N",
  "M",
  "«",
];

const guessRows = [
  ["", "", "", "", ""],
  ["", "", "", "", ""],
  ["", "", "", "", ""],
  ["", "", "", "", ""],
  ["", "", "", "", ""],
  ["", "", "", "", ""],
];

guessRows.forEach((guessRow, guessRowIndex) => {
  const rowElement = document.createElement("div");
  rowElement.setAttribute("id", "guessRow" + guessRowIndex);

  guessRow.forEach((_guess, guessIndex) => {
    const tileElement = document.createElement("div");
    tileElement.setAttribute(
      "id",

      "guessRow_" + guessRowIndex + "_tile_" + guessIndex
    );
    tileElement.classList.add("tile");
    rowElement.append(tileElement);
  });

  tileDisplay.append(rowElement);
});

let currentTile = 0;
let currentRow = 0;
let isGameOver = false;

keys.forEach((key) => {
  const buttonElement = document.createElement("button");
  buttonElement.innerText = key;
  buttonElement.setAttribute("id", key);
  buttonElement.addEventListener("click", () => handleClick(key));
  keyboard.append(buttonElement);
});

const handleClick = (key) => {
  if (!isGameOver) {
    if (key === "«") {
      deleteLetter();
      return;
    }

    if (key === "ENTER") {
      checkRow();
      return;
    }
    addLetter(key);
  }
};

const addLetter = (letter) => {
  if (currentTile < 5 && currentRow < 6) {
    const tile = document.getElementById(
      `guessRow_${currentRow}_tile_${currentTile}`
    );

    tile.setAttribute("data", letter);
    tile.textContent = letter;
    guessRows[currentRow][currentTile] = letter;

    currentTile++;
  }
};

const deleteLetter = () => {
  if (currentTile > 0) {
    currentTile--;
    const tile = document.getElementById(
      `guessRow_${currentRow}_tile_${currentTile}`
    );

    tile.setAttribute("data", "");
    tile.textContent = "";
    guessRows[currentRow][currentTile] = "";
  }
};

const checkRow = () => {
  const guess = guessRows[currentRow].join("");

  if (currentTile > 4) {
    fetch(`https://wordleappclone.onrender.com/check/?word=${guess}`)
      .then((response) => response.json())
      .then((json) => {
        if (json === false) {
          showMessage("Word is not valid");
          return;
        } else {
          flipTile();

          if (wordle == guess) {
            showMessage("Magnificent");
            isGameOver = true;
            return;
          } else {
            if (currentRow >= 5) {
              isGameOver = true;
              showMessage("Game Over");
              return;
            }

            if (currentRow < 5) {
              currentRow++;
              currentTile = 0;
            }
          }
        }
      })
      .catch((err) => {
        console.error(err);
      });
  }
};

const showMessage = (message) => {
  const messageEle = document.createElement("p");
  messageEle.textContent = message;
  messageDisplay.append(messageEle);

  setTimeout(() => {
    messageDisplay.removeChild(messageEle);
  }, 3000);
};

const addKeyColor = (keyLetter, color) => {
  const letterColor = document.getElementById(keyLetter);
  letterColor.classList.add(color);
};

const flipTile = () => {
  const rowTiles = document.querySelector("#guessRow" + currentRow).childNodes;
  let checkWordle = wordle;
  let guess = [];

  rowTiles.forEach((tile) => {
    guess.push({ letter: tile.getAttribute("data"), color: "grey_overlay" });
  });

  guess.forEach((guess, index) => {
    if (guess.letter === wordle[index]) {
      guess.color = "green_overlay";
      checkWordle = checkWordle.replace(guess.letter, "");
    }
  });

  guess.forEach((guess) => {
    if (checkWordle.includes(guess.letter)) {
      guess.color = "yellow_overlay";
      checkWordle = checkWordle.replace(guess.letter, "");
    }
  });

  rowTiles.forEach((t, i) => {
    setTimeout(() => {
      t.classList.add("flip");
      t.classList.add(guess[i].color);
      addKeyColor(guess[i].letter, guess[i].color);
    }, 300 * i);
  });
};
