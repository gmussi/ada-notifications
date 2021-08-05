# Ada Notification Script

This script runs in a schedule and checks an ada wallet for updates.

You receive notifications when:
 
* [x] You receive new rewards from staking
* [x] Your account balance changes
* [x] You make a transaction 
* [ ] Your pool receives delegates
* [ ] Your pool loses delegates
* [ ] Your pool changes the tax fee


## Usage

This script is meant to be run as part of a cron job. An `.env` file must be provided with all the properties as listed below. The file `.env.example` provides the best way to get started.


1. Copy the `.env.example` file to a `.env` file and fill in as explained below.
2. Execute the script:
   1. With node: `npm run run-node` 
   2. With docker: `npm run run-docker`

## Using as a cronjob on a raspberry pi

I personally use this tool as a cronjob on a raspberry pi with docker installed. 
The file `run-cron.sh` is used to pull the latest image and run the code. 
You might need to adjust it based on your local folder structure. 

## Environment variables needed and where to get them

**EMAIL_TO**= Email to receive notifications

**EMAIL_FROM**=Email to send notifications from. Must work with SMTP settings provided.

**BLOCKFROST_API_KEY**= Register on https://blockfrost.io/ to obtain an api key.

**COINMARKETCAP_API_KEY**= Register on https://coinmarketcap.com/ to obtain an api key.

**ADA_STAKE_KEY**= Your ada stake key in the berch32 format: `stake1uxv1234....`

**MONGODB_URL**= Mongodb url containing username and password: `mongodb+srv://user:password@hostname/dbname?retryWrites=true&w=majority`

**SMTP_USERNAME**= SMTP config

**SMTP_PASSWORD**= SMTP config

**SMTP_URL**= SMTP config

**SMTP_PORT**= SMTP config