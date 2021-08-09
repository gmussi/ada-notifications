// Initialize constants and libs
const constants = require("./contants");
const wallet = require("./wallet");
const emails = require("./emails.js");
const {MongoClient} = require('mongodb');

let client, mongodb;
let rewardsdb;
let balancedb;
let transactionsdb;
let pooldb;

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
    pooldb = mongodb.collection("pool");
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

const checkPoolChanges = async (poolId) => {
    console.log("Cheking for changes on pool");

    let poolData = await wallet.getPoolData(poolId);
    
    let pool = await pooldb.find().sort({timestamp: -1}).limit(1).next(); // find last entry

    let shouldCreateRecord = false;
    if (!pool) {
        shouldCreateRecord = true;
    } else if (pool.pool_id == poolData.pool_id) {
        // pool is the same

        // check if the fees changed
        if (pool.margin_cost != poolData.margin_cost) {
            // fees have changed. Notify the user
            await emails.sendMarginChangedEmail(pool.margin_cost, poolData.margin_cost);
            shouldCreateRecord = true;
        }

        // check if number of delegators changes
        if (pool.live_delegators != poolData.live_delegators) {
            await emails.sendDelegatorsChangedEmail(pool.live_delegators, poolData.live_delegators);
            shouldCreateRecord = true;
        }
    } else {
        // Pool has changed. Notify the user 
        await emails.sendPoolChangedEmail(pool.ticker, poolData.ticker);

        shouldCreateRecord = true;
    }

    if (shouldCreateRecord) {
        // insert new pool info on mongodb
        poolData.timestamp = Date.now();
        await pooldb.insertOne(poolData);
    }
};

const main = async () => {
    console.log("Try to init mongodb.")
    await initMongo();
    console.log("Mongodb started successfully.")
    
    let account = await wallet.getAccountDetails();

    await checkRewards();
    await checkBalance();
    await checkTransactions();
    await checkPoolChanges(account.pool_id);
    await client.close();

    console.log("Work is finished.")

};

console.log(`Running script at ${new Date().toString()}`)
main();
