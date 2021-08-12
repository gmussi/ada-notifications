// Ensure necessary variables are present
require('dotenv').config();

const EMAIL_TO = process.env.EMAIL_TO;
const EMAIL_FROM = process.env.EMAIL_FROM;

const BLOCKFROST_API_KEY = process.env.BLOCKFROST_API_KEY;
const COINMARKETCAP_API_KEY = process.env.COINMARKETCAP_API_KEY;
const ADA_STAKE_KEY = process.env.ADA_STAKE_KEY;

const MONGODB_URL = process.env.MONGODB_URL;

const SMTP_USERNAME = process.env.SMTP_USERNAME;
const SMTP_PASSWORD = process.env.SMTP_PASSWORD;
const SMTP_URL = process.env.SMTP_URL;
const SMTP_PORT = process.env.SMTP_PORT;

// these are static and will not change
const BLOCKFROST_ENDPOINT = `https://cardano-mainnet.blockfrost.io/api/v0`;
const ADA_PRICE_ENDPOINT = `https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?symbol=ADA`;

module.exports = Object.freeze({  
    EMAIL_TO,
    EMAIL_FROM, 
    ACCOUNTS_ENDPOINT : `${BLOCKFROST_ENDPOINT}/accounts/${ADA_STAKE_KEY}`,
    REWARDS_ENDPOINT : `${BLOCKFROST_ENDPOINT}/accounts/${ADA_STAKE_KEY}/rewards?page=:page`,
    HISTORY_ENDPOINT : `${BLOCKFROST_ENDPOINT}/accounts/${ADA_STAKE_KEY}/history`,
    ADDRESSES_ENDPOINT : `${BLOCKFROST_ENDPOINT}/accounts/${ADA_STAKE_KEY}/addresses?page=:page`,
    DELEGATIONS_ENDPOINT : `${BLOCKFROST_ENDPOINT}/accounts/${ADA_STAKE_KEY}/delegations`,
    STAKE_POOL_ENDPOINT : `${BLOCKFROST_ENDPOINT}/pools/:poolId`,
    STAKE_POOL_META_ENDPOINT : `${BLOCKFROST_ENDPOINT}/pools/:poolId/metadata`,
    STAKE_POOL_DELEGATORS_ENDPOINT : `${BLOCKFROST_ENDPOINT}/pools/:poolId/delegators?page=:page`,
    TRANSACTIONS_ENDPOINT: `${BLOCKFROST_ENDPOINT}/addresses/:addr/utxos?page=:page`,
    EPOCHS_URL : `${BLOCKFROST_ENDPOINT}/epochs`,
    LATEST_EPOCH_URL : `${BLOCKFROST_ENDPOINT}/epochs/latest`,
    NEXT_EPOCH_ENDPOINT : `${BLOCKFROST_ENDPOINT}/epochs/:num/next`,
    ADA_PRICE_ENDPOINT,
    BLOCKFROST_API_KEY,
    COINMARKETCAP_API_KEY,
    MONGODB_URL,
    SMTP_USERNAME,
    SMTP_PASSWORD,
    SMTP_URL,
    SMTP_PORT
});