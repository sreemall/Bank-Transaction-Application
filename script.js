'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-05-27T17:01:17.194Z',
    '2020-07-11T23:36:17.929Z',
    '2020-07-12T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////

function displayMovements (account) {
  //erase current display
  containerMovements.innerHTML = '';
  //display all movements
  account.movements.forEach ((movement, i) => {
    let type = movement >= 0 ? "deposit" : "withdrawal";
    let date = new Date(account.movementsDates[i]);
    const day = `${date.getDate()}`.padStart(2,0);
    const month = `${date.getMonth()+1}`.padStart(2,0);
    const year = `${date.getFullYear()}`.padStart(2,0);

    let html = `
        <div class="movements__row">
          <div class="movements__type movements__type--${type}">${i+1}, ${type}</div>
          <div class="movements__date">${month}/${day}/${year}</div>
          <div class="movements__value">${movement.toFixed(2)}</div>
        </div>
      `;
    containerMovements.insertAdjacentHTML ("afterbegin", html);
    [...document.querySelectorAll ('.movements__row')]
      .forEach ((row, i) => {
                  if (i%2 == 0) {
                    row.style.backgroundColor = 'coral';                    
                  }
                  else
                    row.style.backgroundColor = 'white';
                });

  });
}

function createUsernames (users) {
  users.forEach ((user) => {
      user.username = user.owner.toLowerCase ()
                          .split(' ')
                          .map (e => e[0])
                          .join('');
  });
}

createUsernames (accounts);
let currentAccount;

const calDisplayCurBalance = function (account) {
  account.balance = account.movements.reduce ((a,c) => a+c, 0);
  labelBalance.textContent = (account.balance).toFixed(2);
  const now = new Date ();
  const day = `${now.getDate()}`.padStart(2,0);
  const month = `${now.getMonth()+1}`.padStart(2,0);
  const year = `${now.getFullYear()}`.padStart(2,0);
  const hour = `${now.getHours()}`.padStart(2,0);
  const min = `${now.getMinutes()}`.padStart(2,0);

  labelDate.textContent = `${month}/${day}/${year}, ${hour}:${min}`;
}

const calDisplaySummary = function (account) {
  const income = account.movements.filter((movement) => movement>0).reduce((a,c) => a+c,0);
  const out = account.movements.filter((movement) => movement<0).reduce((a,c) => a+c,0);
  const interest = account.movements.filter((movement) => movement>0)
                          .map(income=>(income*account.interestRate)/100)
                          .filter (interest => interest>=1)
                          .reduce ((a,c) => a+c,0);
  
  labelSumIn.textContent = (income).toFixed(2);
  labelSumOut.textContent = (Math.abs(out)).toFixed(2);
  labelSumInterest.textContent = (interest).toFixed(2);
}

const handleLogin = function (event) {
  // Prevent form from submitting
  event.preventDefault ();
  //get input user login input values
  let username = inputLoginUsername.value;
  let pin = Number(inputLoginPin.value);
  
  //find account matching to logged in user
  currentAccount = accounts.find ((account) => account.username === username);
  if (currentAccount?.pin === pin)
  {
    console.log ("user ", currentAccount.owner, " logged in", currentAccount.owner.split(' ')[0]);
    //display UI and customize Welcome message
    containerApp.style.opacity = 1
    labelWelcome.textContent = `Good Afternoon, ${currentAccount.owner.split(' ')[0]}!`;
    

    //display movements for this user
    displayMovements (currentAccount);

    //calculate and display current balance of user
    calDisplayCurBalance (currentAccount);

    //calculate and display summary for this user
    calDisplaySummary (currentAccount);
  }
  else
    console.log ("invalid credentials");

    inputLoginUsername.value = '';
    inputLoginPin.value = '';
    inputLoginPin.blur();

};

const updateUI = function (account) {
  //display welcome message
  labelWelcome.textContent = `Good Afternoon, ${account.owner.split(' ')[0]}!`;

  //display movements, balance, summary
  displayMovements(account);
  calDisplayCurBalance (account);
  calDisplaySummary (account);

}

const handleTransferMoney = function (event) {
  // Prevent form from submitting
  event.preventDefault ()

  //determine transfer to amount and account
  let amountTransfered = Number(inputTransferAmount.value);
  let transferToUsername = inputTransferTo.value;
  let toAccount = accounts.find (account => account.username === transferToUsername);

  if (toAccount && toAccount.username != currentAccount.username && amountTransfered>0
            && currentAccount.balance >= amountTransfered) {

    //add deposit and withdrawal movements to corresponding accounts
    currentAccount.movements.push (-amountTransfered);

    const now = new Date();
    currentAccount.movementsDates.push (now.toISOString());

    toAccount.movements.push (amountTransfered);
    toAccount.movementsDates.push (now.toISOString());

    updateUI (toAccount);
  
  }
  else
    console.log ("Invalid transfer");

  //empty tranfer fields
  inputTransferAmount.value = '';
  inputTransferTo.value = '';
}

const handleCloseAccount = function (event) {
  event.preventDefault();
  let closeUsername = inputCloseUsername.value;
  let closePin = inputClosePin.value;

  let index = accounts.findIndex (account => account.username === closeUsername && account.pin === Number(closePin));

  if (index !== -1) {
    //close account
    accounts.splice(index, 1);
  }
  else
    console.log ("invalid credentials");

  //Hide UI
  containerApp.style.opacity = 0;
  // //reset the welcome message
  labelWelcome.textContent = "Log in to get Started";

  inputCloseUsername.value = '';
  inputClosePin.value = '';
}

const handleLoan = function (event) {
  event.preventDefault ();
  let loanAmount = Math.floor(inputLoanAmount.value);
  //approve loan only if there is atleast one deposit >= 10% of the loan amount
  if (currentAccount.movements.some (deposit => deposit >= loanAmount*0.1)) {
    currentAccount.movements.push (loanAmount);
    const now = new Date();
    currentAccount.movementsDates.push (now.toISOString());
    updateUI (currentAccount);
    inputLoanAmount.value = '';
  }
  else
    console.log ("loan is not approved");
}

let isSorted = false;
const handleSort = function (event) {
  event.preventDefault();
  if (isSorted)
    isSorted = false;
  else
    isSorted = true;
  if (isSorted) {
    let original = currentAccount.movements.slice();
    currentAccount.movements.sort((a,b) => a-b);
    updateUI (currentAccount);
    //set current account movement to original values
    currentAccount.movements = original.slice(); 
  }
  else
    updateUI (currentAccount);

}

btnLogin.addEventListener ("click", handleLogin);
btnTransfer.addEventListener ("click", handleTransferMoney);
btnClose.addEventListener ("click", handleCloseAccount);
btnLoan.addEventListener ("click", handleLoan);
btnSort.addEventListener ("click", handleSort);
