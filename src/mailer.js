import nodemailer from 'nodemailer';

const from = '"TelcoTechnician" <info@telcotechnician.com.au>';

// const mailChimpHost = `https://${}`
//
// function mailChimpSetup(){
// 	return nodemailer.createTransport({
// 		host:mailChimpHost,
// 	})
// }


function setup() {
	return nodemailer.createTransport({
		host: process.env.EMAIL_HOST,
		port: process.env.EMAIL_PORT,
		auth: {
			user: process.env.EMAIL_USER,
			pass: process.env.EMAIL_PASS
		}
	});
}

export function sendConfirmationEmail(user) {
	const transport = setup();

	const email = {
		from,
		to: user.email,
		subject: 'Welcome to TelcoTechnician',
		html: `
			<h2>Please click the link to confirm your email</h2>
			<a href=${user.generateConfirmationUrl()}>
			Confirm Email
			</a>
			<br />
			<hr />
			<p>If you are not redirected, please copy then link below</p>
			<p>${user.generateConfirmationUrl()}</p>
		`
	};

	transport.sendMail(email);
}

export function sendResetPasswordEmail(user) {
	const transport = setup();

	const email = {
		from,
		to: user.email,
		subject: 'Password reset request',
		html: `
      <h2>Please click the link to reset your password</h2>
			<a href=${user.generateResetPasswordLink()}>
			Reset Password
			</a>
			<br />
			<hr />
			<p>If you are not redirected, please copy then link below</p>
      <p>${user.generateResetPasswordLink()}</p>
    `
	};

	transport.sendMail(email);
}

export function sendCorrectUserEmail(user) {
	const transport = setup();

	const email = {
		from,
		to: user.email,
		subject: 'Password changed',
		html: `
      <h4>Your password has been changed successfully.</h4>
			<p>If you are haven't changed you password recently, please contact us.</p>
    `
	};

	transport.sendMail(email);
}
