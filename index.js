require('dotenv').config()

const emailUtils = require('./utils/email-utils');
var nodemailer = require('nodemailer');

var users = require('./data/users.json');
var remainingUsers = [...users];

var transporter = emailUtils.createTransporter(nodemailer);

emailUtils.sendEmails(transporter, users, remainingUsers);