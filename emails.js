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
                from: "Ada Script <hello@imagile.io>",
                to: "gmussi@gmail.com",
                subject: `New ada reward of ${reward.amount_num} for epoch ${reward.epoch}`,
                text: JSON.stringify(reward),
                html: JSON.stringify(reward)
            });
    
            console.log("Email sent", JSON.stringify(info));
        } catch (err) {
            console.error("Error sending email", err);
        }
    }
};