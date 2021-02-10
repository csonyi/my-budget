# MyBudget

Budget handling app created with React and MaterialUI.

## Goal of the project

understand a basic building blocks of a React app and demonstrate it in a practice.
making tests are not part of the requirements due to keep the scope focused

## Features

These are the applications current capabilties.

### Accounts

You are able to create, delete and modify several accouts, wich can represent your real-life ways of keeping your money.
Each account has a name, an initial balance and a currency associated with it.

### Transactions

You can create any number of transactions associated with your accounts. A transaction needs an amount, an account and a currency.
If the transaction's currency differs from the account's, you can see the transactions value in the accounts native currency next to the actual amount.

After creating a transaction, you can see that it has a checkmark next to it. Checking it will mark the transaction as "completed".
This way you can plan your incomes and expenses before they actually happen.

Marking a transaction "completed" will deduct it from the account associated with it, unmarking it will reverse this.

### Dashboard

On the Dashboard you can see your current and projected balances by currency.
Your balances are basically the sums of your account balances, and the projected balances are where you will be once all of your planned transactions are marked completed.

## Other dependencies used:

- clsx - for easier class definitions
- uuid - a lightweight unique ID generator

## Starting the application

After cloning the repository, you have to first run `npm install` and then you can start the application by running `npm start` (both in the root directory).

## Original requirements

- choose a tech stack (React, MaterialUI)
- budget planning app
  - fetching currency data from 3rd party API
  - logging incomes/expenses
    - properties
      - income / expense
      - planned / completed
      - amount, currency
      - affected account
  - account handling
    - CRUD
    - properties: name, currency, balance
  - several pages with frontend routing
    - accounts
    - transactions
    - dashboard
  - saving to localstorage

### Planned, but not comleted

- category handling
  - creating, editing and deleting categories
