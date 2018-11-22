const chai = require('chai');
const expect = chai.expect;

let users;
let remainingUsers;

const emailUtils = require('../utils/email-utils');

describe('test the email utils', () => {
	beforeEach((done) => {
		users = require('./resources/test-users.json');
		remainingUsers = [ ...users ];

		process.env.EMAIL_SENDER = 'sample@gmail.com';
		process.env.EMAIL_SENDER = 'sender';
		process.env.EMAIL_USER = 'user';
		process.env.EMAIL_PASSWORD = 'password';
		process.env.EMAIL_SERVICE = 'gmail';
		done();
	});

	it('test email options for a user', () => {
		let user = users[0];
		user.option = remainingUsers[1];
		const emailOptions = emailUtils.getEmailOptions(user);

		// check the email key options
		expect(emailOptions).to.has.property('to');
		expect(emailOptions).to.has.property('from');
		expect(emailOptions).to.has.property('subject');
		expect(emailOptions).to.has.property('html');

		// check the email values
		expect(emailOptions.from).to.be.eq(process.env.EMAIL_SENDER);
		expect(emailOptions.to).to.be.eq(user.email);
		expect(emailOptions.subject).to.be.eq(emailUtils.getEmailSubject());
		expect(emailOptions.html).to.be.eq(emailUtils.getEmailHtml(user));
	});

	it('test email subject', () => {
		expect(emailUtils.getEmailSubject()).to.be.eq('Secret Santa');
	});

	it('test email html', () => {
		let user = users[0];
		user.option = remainingUsers[1];
		expect(emailUtils.getEmailHtml(user)).to.be.eq(`<p>${user.option.name}</p>`);
	});

	it('test getting random user', () => {
		let user = users[0];

		const randUser = emailUtils.getRandomUser(user, remainingUsers);

		expect(randUser.name).to.not.eq(user.name);
	});

	it('test generating user options', () => {
		const usersWithOptions = emailUtils.generateUserOptions(users, remainingUsers);

		expect(remainingUsers).to.be.empty;

		usersWithOptions.forEach((user) => {
			// make sure the user is not the same as the user option
			expect(user).to.not.eql(user.option);

			// make sure the user is only present once as an option
			const optionCount = usersWithOptions.filter((usr) => usr.option.name === user.name && user.option.email && user.email).length;
			expect(optionCount).to.be.eq(1);

			// make sure the user is only present once as a user
			const userCount = usersWithOptions.filter((usr) => usr.name === user.name && usr.email === user.email).length;
			expect(userCount).to.be.eq(1);
		});
	});
});
