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
    }
};