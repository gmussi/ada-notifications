# Ada Notification Script

This script is meant to be run as part of a cron job. An `.env` file must be provided with all the properties as listed below. The file `.env.example` provides the best way to get started.

## Usage

1. Copy the `.env.example` file to a `.env` file and fill in as explained below.
2. Execute the script:
   1. With node: `npm run run-node` 
   2. With docker: `npm run run-docker`

## Environment variables needed and where to get them

**BLOCKFROST_API_KEY**= Register on https://blockfrost.io/ to obtain an api key.

**COINMARKETCAP_API_KEY**= Register on https://coinmarketcap.com/ to obtain an api key.

**ADA_STAKE_KEY**= Your ada stake key in the berch32 format: `stake1uxv1234....`

**MONGODB_URL**= Mongodb url containing username and password: `mongodb+srv://user:password@hostname/dbname?retryWrites=true&w=majority`

**SMTP_USERNAME**= SMTP config

**SMTP_PASSWORD**= SMTP config

**SMTP_URL**= SMTP config

**SMTP_PORT**= SMTP config