// Initialize constants and libs
const constants = require("./contants");
const axios = require("axios");

module.exports = {
    getAccountDetails: async() => {
        // get account details
        let response = await axios.get(constants.ACCOUNTS_ENDPOINT, {
            headers: {'project_id': constants.BLOCKFROST_API_KEY}
        });

        return response.data;
    },

    getRewards: async () => {
        let result = [];
        let hasMorePages = true;
        let page = 1;
        do {
            let response = await axios.get(constants.REWARDS_ENDPOINT.replace(":page", page++), {
                headers: {'project_id': constants.BLOCKFROST_API_KEY}
            });
            hasMorePages = response.data.length == 100;
            result.push(...response.data);
        } while (hasMorePages);

        return result;
    },

    getBalance: async () => {
        let response = await axios.get(constants.ACCOUNTS_ENDPOINT, {
            headers: {'project_id': constants.BLOCKFROST_API_KEY}
        })
        return parseInt(response.data.controlled_amount) / 1000000;
    },

    getMyAddresses: async () => {
        console.log("Loading my addresses...")
        let result = [];
        let hasMorePages = true;
        let page = 1;

        do {
            let response = await axios.get(constants.ADDRESSES_ENDPOINT.replace(":page", page++), {
                headers: {'project_id': constants.BLOCKFROST_API_KEY}
            })
            hasMorePages = response.data.length == 100;
            result.push(...response.data);
        } while (hasMorePages);
        return result.map(d => d.address);
    },

    getTransactions: async () => {
        let addresses = await module.exports.getMyAddresses();
        
        console.log("Finding my transactions...")
        let result = [];

        for (let addr of addresses) {
            let hasMorePages = true;
            let page = 1;

            do {
                let response = await axios.get(constants.TRANSACTIONS_ENDPOINT.replace(":addr", addr).replace(":page", page++), {
                    headers: {'project_id': constants.BLOCKFROST_API_KEY}
                });

                hasMorePages = response.data.length == 100;

                response.data.forEach(utxo => utxo.amount.forEach( a => 
                    result.push({
                        "block": utxo.block, 
                        "unit": a.unit, 
                        "amount": a.quantity,
                        "amount_num": parseInt(a.quantity) / 1000000
                    })
                ));
            } while (hasMorePages);
        }

        return result;
    },

    getPoolData: async (poolId) => {
        //get pool details
        let response = await axios.get(constants.STAKE_POOL_ENDPOINT.replace(":poolId", poolId), {
            headers: {'project_id': constants.BLOCKFROST_API_KEY}
        });

        let poolData = response.data;
        //get pool metadata
        response = await axios.get(constants.STAKE_POOL_META_ENDPOINT.replace(":poolId", poolId), {
            headers: {'project_id': constants.BLOCKFROST_API_KEY}
        })

        return Object.assign(poolData, response.data);
    }
};