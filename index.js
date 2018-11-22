require('dotenv').config()

var url = require('url');
var nodemailer = require('nodemailer');

var users = require('./data/users.json');
var remainingOptions = [...users];

var transporter = createTransporter();

sendEmails(users);

/**
 * Sends emails to the users with their options
 * @param {array} users the users to send the emails to
 */
function sendEmails(users){
    generateUserOptions(users).forEach(user => {
        sendEmail(getEmailOptions(user));
    });
}

/**
 * Generate the users options
 * @param {array} users the users to generate options for
 */
function generateUserOptions(users){
    return users.map((user) => {
        return {...user, option: getRandomUser(user, remainingOptions)};
    });
}

/**
 * Gets a random user object from the remaining user array
 * @param {object} user the user object
 * @param {array} remainingOptions the remainingOptions array
 */
function getRandomUser(user, remainingOptions){
    let randUser = user
    do {
        randUser = remainingOptions[Math.floor(Math.random() * remainingOptions.length)];
    } while (randUser.name === user.name);

    const index = remainingOptions.indexOf(randUser);
    remainingOptions.splice(index, 1);
    return randUser;
}

/**
 * Gets a transporter for sending the emails
 */
function createTransporter(){
    return nodemailer.createTransport(`smtps://${process.env.EMAIL_USER}%40gmail.com:${process.env.EMAIL_PASSWORD}@smtp.gmail.com`);
}

/**
 * Gets the email details for the supplied user
 * @param {object} user the user object to create the email options from
 */
function getEmailOptions(user){
    return {
        from: process.env.EMAIL_SENDER,
        to: user.email,
        subject: 'Secret Santa',
        html: `<p>${user.option.name}</p>`
    }
}

/**
 * Sends an email using the supplied mail options
 * @param {object} mailOptions the options to use for sending the email
 */
function sendEmail(mailOptions){
    transporter.sendMail(mailOptions, (err, info) => {
        if(err){
            console.error(err);
        }else{
            console.log(info);
        }
    })
}