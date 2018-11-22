const winston = require('winston');
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    transports:[
        new winston.transports.File({ filename: 'error.log', level: 'error'}),
        new winston.transports.File({ filename: 'combined.log'})
    ]
});

/**
 * Sends emails to the users with their options
 * @param {object} transporter the transporter to use for sending the emails
 * @param {array} users the users to send the emails to
 * @param {array} remainingUsers the remaining users to select from
 */
function sendEmails(transporter, users, remainingUsers) {
    logger.info('Generated Users with Options:\n');
    generateUserOptions(users, remainingUsers).forEach((user) => {
        logger.info(user);
        sendEmail(transporter, getEmailOptions(user));
    });
}

/**
 * Sends an email using the supplied mail options
 * @param {object} transporter the nodemailer transporter for sending the emails
 * @param {object} mailOptions the options to use for sending the email
 */
function sendEmail(transporter, mailOptions){
    transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
            logger.error(err);
        } else {
            logger.info(info);
        }
    });
}

/**
 * Generate the users options
 * @param {array} users the users to generate options for
 * @param {array} remainingUsers the remaining users left to choose from
 */
function generateUserOptions(users, remainingUsers) {
    return users.map((user) => {
        return { ...user, option: getRandomUser(user, remainingUsers) };
    });
}

/**
 * Gets a random user object from the remaining user array
 * @param {object} user the user object
 * @param {array} remainingUsers the remainingUsers array
 */
function getRandomUser(user, remainingUsers) {
    let randUser = user;
    do {
        randUser = remainingUsers[Math.floor(Math.random() * remainingUsers.length)];
    } while (randUser.name === user.name);

    const index = remainingUsers.indexOf(randUser);
    remainingUsers.splice(index, 1);
    return randUser;
}

/**
 * Gets a transporter for sending the emails
 */
function createTransporter(nodemailer) {
    return nodemailer.createTransport(
        `smtps://${process.env.EMAIL_USER}${encodeURIComponent('@')}gmail.com:${process.env
            .EMAIL_PASSWORD}@smtp.gmail.com`
    );
}

/**
 * Gets the email details for the supplied user
 * @param {object} user the user object to create the email options from
 */
function getEmailOptions(user) {
    return {
        from: process.env.EMAIL_SENDER,
        to: user.email,
        subject: getEmailSubject(),
        html: getEmailHtml(user)
    };
}

/**
 * Returns the subject for the email
 */
function getEmailSubject(){
    return 'Secret Santa';
}

/**
 * Returns html for the email
 * @param {object} user the user object to use in the html
 */
function getEmailHtml(user) {
    return `<p>${user.option.name}</p>`
}

module.exports = {
    sendEmails: sendEmails,
    generateUserOptions: generateUserOptions,
    getRandomUser: getRandomUser,
    createTransporter: createTransporter,
    getEmailOptions: getEmailOptions,
    getEmailSubject: getEmailSubject,
    getEmailHtml: getEmailHtml,
    sendEmail: sendEmail
};
