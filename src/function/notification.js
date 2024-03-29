const nodemailer = require('nodemailer');
const {
	SMTP_GMAIL_SERVICE,
	SMTP_GMAIL_HOST,
	SMTP_GMAIL_PORT,
	SMTP_GMAIL_USER,
	SMTP_GMAIL_APP_PASS
} = process.env;

module.exports.notificationManagement = ({ receivers, data }) => {
	let receiversList = [];
	if (typeof receivers === "string") {
		receiversList.push(receivers);
	} else {
		receiversList.push(...receivers);
	}
	const receiversFormat = receiversList.join(", ");
	const subject = "Notification (File Upload Service)";
	const message = `You have uploaded a file named "${data?.fileNameOriginal}.${data?.fileExtension}"`;
	this.sendSMTPProviders({ receivers: receiversFormat, subject, message });
	return;
};

// * Use Gmail provider for test send mail
module.exports.sendSMTPProviders = ({ receivers, subject, message }) => {
	const transporter = nodemailer.createTransport({
		service: SMTP_GMAIL_SERVICE,
		host: SMTP_GMAIL_HOST,
		port: SMTP_GMAIL_PORT,
		auth: {
			user: SMTP_GMAIL_USER,
			pass: SMTP_GMAIL_APP_PASS
		}
	});

	const msgOptions = {
		from: SMTP_GMAIL_USER,
		to: receivers,
		subject: subject,
		text: message,
	};

	transporter.sendMail(msgOptions, (error, info) => {
		if (error) {
			console.error("Error to sending email : ", error);
		}
	});
};