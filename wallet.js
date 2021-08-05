// Initialize constants and libs
const constants = require("./contants");
const axios = require("axios");

module.exports = {
    getRewards: async () => {
        let response = await axios.get(constants.REWARDS_ENDPOINT, {
            headers: {'project_id': constants.BLOCKFROST_API_KEY}
        });
        return response.data;
    },

    getBalance: async () => {
        let response = await axios.get(constants.ACCOUNTS_ENDPOINT, {
            headers: {'project_id': constants.BLOCKFROST_API_KEY}
        })
        return parseInt(response.data.controlled_amount) / 1000000;
    },

    getMyAddresses: async () => {
        console.log("Loading my addresses...")
        let response = await axios.get(constants.ADDRESSES_ENDPOINT, {
            headers: {'project_id': constants.BLOCKFROST_API_KEY}
        })
        return response.data.map(d => d.address);
    },

    getTransactions: async () => {
        let addresses = await module.exports.getMyAddresses();
        
        console.log("Finding my transactions...")
        let transactions = [];

        for (let addr of addresses) {
            let response = await axios.get(constants.TRANSACTIONS_ENDPOINT.replace(":addr", addr), {
                headers: {'project_id': constants.BLOCKFROST_API_KEY}
            });

            response.data.forEach(o => console.log(o));

            response.data.forEach(utxo => utxo.amount.forEach( a => 
                transactions.push({
                    "block": utxo.block, 
                    "unit": a.unit, 
                    "amount": a.quantity,
                    "amount_num": parseInt(a.quantity) / 1000000
                })
            ));
        }

        return transactions;
    },
};