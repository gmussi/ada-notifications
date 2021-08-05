// Initialize constants and libs
const constants = require("./contants");
const wallet = require("./wallet");
const emails = require("./emails.js");
const {MongoClient} = require('mongodb');

let client, mongodb;
let rewardsdb;
let balancedb;
let transactionsdb;

const onNewReward = async (reward) => {
    console.log("inserting new reward: ", JSON.stringify(reward));

    try {
        // insert on mongodb
        await rewardsdb.insertOne(reward);

        // send out notification
        await emails.sendNewRewardEmail(reward);
    } catch (err) {
        console.error(err);
    }
};

const onBalanceChange = async (oldBalance, newBalance) => {
    try {
        // insert new balance on mongodb
        await balancedb.insertOne({
            amount: newBalance,
            timestamp: Date.now()
        });

        // if this is not first entry, send email
        if (oldBalance) {
            await emails.sendBalanceChangeEmail(oldBalance.amount, newBalance);
        }
    } catch (err) {
        console.error(err);
    }
};

const onNewTransaction = async (transaction) => {
    try {
        // insert new transaction on mongodb
        await transactionsdb.insertOne(transaction);

        console.log("new deposit found: " + transaction)
        await emails.sendTransactionEmail(transaction);
    } catch (err) {
        console.error(err);
    }
};

const initMongo = async () => {
    // connect to mongo and check and load entries
    client = new MongoClient(constants.MONGODB_URL);
    await client.connect();
    mongodb = client.db("ada");

    rewardsdb = mongodb.collection("rewards");
    balancedb = mongodb.collection("balance");
    transactionsdb = mongodb.collection("transactionsdb");
}

const checkRewards = async () => {
    // for each reward, check if any new rewards need to be inserted into the database
    console.log("Checking for rewards...");
    let rewards = await wallet.getRewards();

    for (let reward of rewards) {
        reward.amount_num = parseInt(reward.amount) / 1000000;

        let exists = await rewardsdb.findOne({epoch: reward.epoch});

        if (!exists) {
            await onNewReward(reward);
        }
    }
};

const checkBalance = async () => {
    // check for balance changes
    console.log("Check for balance changes...");
    let balance = await wallet.getBalance(); // find current balance

    let oldBalanceRecord = await balancedb.find().sort({timestamp: -1}).limit(1).next(); // find last balance
    if (!oldBalanceRecord || balance != oldBalanceRecord.amount) {
        await onBalanceChange(oldBalanceRecord, balance);
    }
};

const checkTransactions = async () => {
    // check for all transactions
    console.log("Check for transactions...");

    let transactions = await wallet.getTransactions();

    for (let transaction of transactions) {
        let exists = await transactionsdb.findOne(transaction);

        if (!exists) {
            await onNewTransaction(transaction);
        }
    }
};

const main = async () => {
    console.log("Try to init mongodb.")
    await initMongo();
    console.log("Mongodb started successfully.")

    let promise1 = checkRewards();
    let promise2 = checkBalance();
    let promise3 = checkTransactions();
    
    await Promise.all([promise1, promise2, promise3]);

    await client.close();

    console.log("Work is finished.")

};

console.log(`Running script at ${new Date().toString()}`)
main();
