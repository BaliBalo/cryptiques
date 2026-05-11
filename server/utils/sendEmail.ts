import nodemailer from 'nodemailer';
import secrets from '~~/secrets';

const transporter = nodemailer.createTransport(secrets.emailTransport || {});

export async function sendEmail(mailOptions: { to?: string, subject: string, text?: string, html?: string }) {
	await transporter.sendMail({
		from: '"Cryptiques" <cryptiques@balibalo.xyz>',
		to: mailOptions.to || 'cryptiques@balibalo.xyz',
		subject: mailOptions.subject,
		text: mailOptions.text,
		html: mailOptions.html,
	});
}