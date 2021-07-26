// Initialize constants and libs
const constants = require("./contants");
const wallet = require("./wallet");
const emails = require("./emails.js");
const {MongoClient} = require('mongodb');

let client;
let rewardsdb;

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
}

const initMongo = async () => {
    // connect to mongo and check and load entries
    //let uri = `mongodb+srv://${constants.MONGODB_USER}:${constants.MONGODB_PASS}@${constants.MONGODB_URL}/ada?retryWrites=true&w=majority`;
    client = new MongoClient(constants.MONGODB_URL);
    await client.connect();
    mongodb = client.db("ada");
    rewardsdb = mongodb.collection("rewards");
}

const main = async () => {
    console.log("Try to init mongodb.")
    await initMongo();

    console.log("Mongodb started successfully.")
    
    // for each reward, check if any new rewards need to be inserted into the database
    let rewards = await wallet.getRewards();

    for (let reward of rewards) {
        reward.amount_num = parseInt(reward.amount) / 1000000;

        let exists = await rewardsdb.findOne({epoch: reward.epoch});

        if (!exists) {
            await onNewReward(reward);
        }
    }

    await client.close();

    console.log("Work is finished.")

};

main();
