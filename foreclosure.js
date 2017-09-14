'use strict';

var steve;

var stevesLoan;

var month = 0;

var monthsUntilEvicted;

function loan () {
  var account = { // "ACCOUNT" IS THE VARIABLE THAT IS CLOSURE
    borrowed :550000,
    balance :286000,
    monthlyPayment :1700,
    defaulted :0,
    defaultsToForeclose :5,
    foreclosed :false
  };

  function missPayment () {
    account.defaulted++;
    if (account.defaulted >= account.defaultsToForeclose) {
      account.foreclosed = true;
    }
  }

  function getBalance () {  // THIS IS REVEALING MODULE PATTERN
    return account.balance;
  }

  function receivePayment (amount) {
    if (amount < account.monthlyPayment) {
      missPayment();
    }
    account.balance -= amount;
  }

  function getMonthlyPayment () {
    return account.monthlyPayment;
  }

  function isForeclosed () {
    return account.foreclosed;
  }

  return {
    getBalance : getBalance,
    receivePayment : receivePayment,
    getMonthlyPayment : getMonthlyPayment,
    isForeclosed : isForeclosed
  };
}

function borrower (loan) {
  var account = { // "ACCOUNT" IS THE VARIABLE THAT IS CLOSURE
    monthlyIncome :1350,
    funds : 2800,
    loan : loan
  };

  function getFunds () { // THIS IS REVEALING MODULE
    return account.funds;
  }

  function makePayment () {
    if (account.funds > loan.getMonthlyPayment()) {
      account.funds -= loan.getMonthlyPayment();
      loan.receivePayment(loan.getMonthlyPayment());
    } else {
      loan.receivePayment(account.funds);
      account.funds = 0;
    }
  }

  function payDay () {
    account.funds += account.monthlyIncome;
  }

  return { //API
    getFunds : getFunds,
    makePayment : makePayment,
    payDay : payDay
  };
}

stevesLoan = loan(); // stevesloan is now an object , to be passed to borrower

steve = borrower(stevesLoan);

while (!stevesLoan.isForeclosed()) { // is not foreclosed
  steve.payDay();
  steve.makePayment();
  month++;

  if (stevesLoan.getBalance <= 0) {
    break;
  }
}
monthsUntilEvicted = month;

