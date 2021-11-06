require('dotenv').config();
const fs = require('fs');
const winston = require('winston');
const nodemailer = require('nodemailer');
const { Command } = require('commander');
const emailUtils = require('./utils/email-utils');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
});

const program = new Command();

program
  .requiredOption('-u, --users-file <file>', 'Required, the json file containing the users')
  .option('-d, --dry-run', 'Optional, if provided the emails will not be sent, but the user pairs will be shown');

program.parse(process.argv);

const options = program.opts();

const { usersFile: usersFilePath, dryRun: isDryRunEnabled } = options;

if (!usersFilePath) {
  logger.error('Users file path was not provided. --users-file is required.');
  process.exit(1);
}

if (!fs.existsSync(usersFilePath)) {
  logger.error(`File path "${usersFilePath}" does not exist`);
  process.exit(1);
}

if (isDryRunEnabled) {
  logger.info('Dry run is ENABLED');
}

const users = JSON.parse(fs.readFileSync(usersFilePath));

const remainingUsers = [...users];

const transporter = emailUtils.createTransporter(nodemailer);

emailUtils.sendEmails({
  transporter, users, remainingUsers, logger, isDryRunEnabled
});
