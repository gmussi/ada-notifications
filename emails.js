const constants = require("./contants");
const nodemailer = require("nodemailer");

let transporter = nodemailer.createTransport({
    host: constants.SMTP_URL,
    port: constants.SMTP_PORT,
    secure: true, 
    auth: {
        user: constants.SMTP_USERNAME, 
        pass: constants.SMTP_PASSWORD, 
    },
});

module.exports = {
    sendNewRewardEmail: async (reward) => {
        try {
            let info = await transporter.sendMail({
                from: `Ada Script <${constants.EMAIL_FROM}>`,
                to: constants.EMAIL_TO,
                subject: `New ada reward of ${reward.amount_num} for epoch ${reward.epoch}`,
                text: JSON.stringify(reward),
                html: JSON.stringify(reward)
            });
    
            console.log("Email sent", JSON.stringify(info));
        } catch (err) {
            console.error("Error sending new reward email", err);
        }
    },

    sendBalanceChangeEmail: async (oldBalance, newBalance) => {
        try {
            let info = await transporter.sendMail({
                from: `Ada Script <${constants.EMAIL_FROM}>`,
                to: constants.EMAIL_TO,
                subject: `Your ADA balance changed from ${oldBalance} to ${newBalance}`,
                text: JSON.stringify({oldBalance, newBalance}),
                html: JSON.stringify({oldBalance, newBalance})
            });
    
            console.log("Email sent", JSON.stringify(info));
        } catch (err) {
            console.error("Error sending balance change email", err);
        }
    },

    sendTransactionEmail: async (transaction) => {
        try {
            let info = await transporter.sendMail({
                from: `Ada Script <${constants.EMAIL_FROM}>`,
                to: constants.EMAIL_TO,
                subject: `There was a deposit of ${transaction.amount_num} received`,
                text: JSON.stringify(transaction),
                html: JSON.stringify(transaction)
            });
    
            console.log("Email sent", JSON.stringify(info));
        } catch(err) {
            console.error("Error sending transaction email", err);
        }
    },

    sendMarginChangedEmail: async (oldMargin, newMargin) => {
        try {
            let info = await transporter.sendMail({
                from: `Ada Script <${constants.EMAIL_FROM}>`,
                to: constants.EMAIL_TO,
                subject: `Your pool changed margin from ${oldMargin}% to ${newMargin}%`,
                text: JSON.stringify({oldMargin, newMargin}),
                html: JSON.stringify({oldMargin, newMargin})
            });
    
            console.log("Email sent", JSON.stringify(info));
        } catch(err) {
            console.error("Error sending margin changed email", err);
        }
    },

    sendDelegatorsChangedEmail: async (oldDelegators, newDelegators) => {
        try {
            let info = await transporter.sendMail({
                from: `Ada Script <${constants.EMAIL_FROM}>`,
                to: constants.EMAIL_TO,
                subject: 
                    oldDelegators > newDelegators ?
                    `Your pool lost ${oldDelegators - newDelegators} delegators and has ${newDelegators} delegators now` :
                    `Your pool gained ${newDelegators - oldDelegators} delegators and has ${newDelegators} delegators now`
                ,
                text: JSON.stringify({oldDelegators, newDelegators}),
                html: JSON.stringify({oldDelegators, newDelegators})
            });
    
            console.log("Email sent", JSON.stringify(info));
        } catch(err) {
            console.error("Error sending margin changed email", err);
        }
    },

    sendPoolChangedEmail: async (oldPoolTicker, newPoolTicker) => {
        try {
            let info = await transporter.sendMail({
                from: `Ada Script <${constants.EMAIL_FROM}>`,
                to: constants.EMAIL_TO,
                subject: `Your pool changed from ${oldPoolTicker} to ${newPoolTicker}`
                ,
                text: JSON.stringify({oldPoolTicker, newPoolTicker}),
                html: JSON.stringify({oldPoolTicker, newPoolTicker})
            });
    
            console.log("Email sent", JSON.stringify(info));
        } catch(err) {
            console.error("Error sending margin changed email", err);
        }
    }
};