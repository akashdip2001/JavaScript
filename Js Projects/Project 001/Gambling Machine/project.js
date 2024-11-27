// 1. Despot some money
// 2. Determine number of lines to bet on
// 3. Collect a bet amount
// 4. Spin the slot machine
// 5. Check if the user won
// 6. Give the user their winnings
// 7. Play again

const prompt = require("prompt-sync")();

// 4. Spin the slot machine
const ROWS = 3;
const COLS = 3;

const SYMBOLS_COUNT = {
  "🍒": 2,
  "🍊": 4,
  "🍋": 6,
  "🍉": 8,
  "🍇": 10,
  "🍓": 12,
  "🍌": 14,
  "🍍": 16,
};

const SYMBOLS_VALIES = {
  "🍒": 9,
  "🍊": 8,
  "🍋": 7,
  "🍉": 6,
  "🍇": 5,
  "🍓": 4,
  "🍌": 3,
  "🍍": 2,
};

// 1. Despot some money
const deposit = () => {
  while (true) {
    const depositAmount = prompt("How much would you like to deposit? ");
    const numberDepositAmount = parseFloat(depositAmount);

    if (isNaN(numberDepositAmount) || numberDepositAmount <= 0) {
      console.log("Please enter a valid number.");
    } else {
      console.log(`You have deposited $${numberDepositAmount}`);
      return numberDepositAmount; // Return the deposit amount
    }
  }
};


// 2. Determine number of lines to bet on
const getNumberofLine = () => {
  while (true) {
    const lines = prompt("Enter the number of lines to bet on (1-3): ");
    const numberofLines = parseFloat(lines);

    if (isNaN(numberofLines) || numberofLines <= 0 || numberofLines > 3) {
      console.log("Please enter a valid number of lines.");
    } else {
      console.log(`You are betting on ${numberofLines} line(s).`);  // Corrected line
      return numberofLines; // Return the number of lines
    }
  }
};


// 3. Collect a bet amount
const getBet = (balance, lines) => {
  while (true) {
    const betAmount = prompt("Enter the amount you want to bet per Line: ");
    const numberBetAmount = parseFloat(betAmount);

    if (
      isNaN(numberBetAmount) ||
      numberBetAmount <= 0 ||
      numberBetAmount > balance / lines
    ) {
      console.log("Please enter a valid amount to bet.");
    } else {
      console.log(`You have bet $${numberBetAmount}.`);
      return numberBetAmount; // Return the bet amount
    }
  }
};

// 4.
const spin = () => {
  const symbols = [];
  for (const [Symbol, count] of Object.entries(SYMBOLS_COUNT)) {
    for (let i = 0; i < count; i++) {
      symbols.push(Symbol);
    }
  }

  const reels = [];
  for (let i = 0; i < COLS; i++) {
    reels.push([]);
    const reelSymbols = [...symbols];
    for (let j = 0; j < ROWS; j++) {
        const randomIndex = Math.floor(Math.random() * reelSymbols.length);
      const selectedSymbol = reelSymbols[randomIndex];
        reels[i].push(selectedSymbol);
        reelSymbols.splice(randomIndex, 1);
    }
  }
  return reels;
};

// 5. Check if the user won
// [[A B C], [A A A], [D D D]]
// Transpose the Matrix formate
// [A B C]
// [A A A]
// [D D D]
const transpose = (reels) => {
    const rows = [];

    for (let i = 0; i < ROWS; i++) {
        rows.push([]);
        for (let j = 0; j < COLS; j++) {
            rows[i].push(reels[j][i]);
        }
    }
    return rows;
}

// 5.1 this is for printing the rows
const printRows = (rows) => {
    for (const row of rows) {
        let rowString = "";
        for (const [i, symbol] of row.entries()) {
            rowString += symbol;
            if (i != row.length - 1) {
                rowString += " | ";
            }
        }
        console.log(rowString);
    }
};

// 6. Give the user their winnings
const getWinning = (rows, bet, lines) => {
  let winnings = 0;

  for (let row = 0; row < lines; row++) {
    const symbols = rows[row];
    let allSame = true;

    for (const symbol of symbols) {
      if (symbol != symbols[0]) {
        allSame = false;
        break;
      }
    }
    if (allSame) {
      winnings += SYMBOLS_VALIES[symbols[0]] * bet;
    }
  }
  return winnings; // Return the total winnings
};

//6.1 Track the balance in a function
const game = () => {
  // 1. 2. 3. Game flow
  let balance = deposit(); // Prompt the user for deposit
  while (true) {
    console.log(`Your balance is $${balance}.`); // Print the balance
    const numberofLines = getNumberofLine(); // 1. 2. 3. Get number of lines
    const betAmount = getBet(balance, numberofLines); // 1. 2. 3. Get bet amount
    balance -= betAmount * numberofLines; // 6.1 Track the balance in a function
    const reels = spin(); // 4.
    const rows = transpose(reels); // 5. Call the transpose function to define 'rows'
    printRows(rows); // 5.1 Call the printRows function to print the rows
    const winnings = getWinning(rows, betAmount, numberofLines); // 6.
    balance += winnings; // 6.1 Track the balance in a function
    console.log(`You won $${winnings}.`); // Print the winnings

    // 6.2
    if (balance <= 0) {
      console.log("You have run out of money!");
      break;
    }
    // 7. Play again
    const playAgain = prompt("Do you want to play again? (yes/no) ");

    if (playAgain != "yes") {
      console.log(`You have $${balance}.`);
      console.log("Thank you for playing!");
      break; // Exit the loop to stop the game
    }
  }
};

game(); // Call the game function to start the game
