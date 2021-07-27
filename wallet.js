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
    }
};