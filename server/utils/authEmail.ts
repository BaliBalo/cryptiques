import jwt from 'jsonwebtoken';
import { z } from 'zod';
import secrets from '~~/secrets';
import { sendEmail } from '~~/server/utils/sendEmail';

const spamProtectionToken = new Map();

const jwtSchema = z.object({ email: z.email() });

function cleanupSpamProtectionTokens() {
	const now = Date.now();
	for (const [token, expiry] of spamProtectionToken.entries()) {
		if (expiry < now) {
			spamProtectionToken.delete(token);
		}
	}
}

export async function generateSpamProtectionToken() {
	cleanupSpamProtectionTokens();
	const token = crypto.randomUUID();
	spamProtectionToken.set(token, Date.now() + 1000 * 60 * 60);
	return token;
}

export function verifySpamProtectionToken(token: string) {
	const exists = spamProtectionToken.has(token);
	spamProtectionToken.delete(token);
	return exists;
}

export async function generateJWT(email: string) {
	const payload: z.infer<typeof jwtSchema> = {
		email,
	};
	return jwt.sign(payload, secrets.secretKey, { expiresIn: '1h' });
}

export async function verifyJWT(token: string) {
	try {
		const decoded = jwtSchema.parse(jwt.verify(token, secrets.secretKey));
		return decoded.email;
	} catch { /**/ }
	return null;
}

export async function sendAuthEmail(email: string) {
	const token = await generateJWT(email);
	const link = `https://cryptiques.balibalo.xyz/auth/email?token=${token}`;
	await sendEmail({
		to: email,
		subject: '[Cryptiques] Votre lien de connexion',
		text: `Utilisez le lien suivant pour vous connecter à Cryptiques : ${link}
Si vous n'avez pas demandé ce message, vous pouvez l'ignorer.`,
		html: `
<!DOCTYPE html>
<html>
	<head>
		<style type="text/css">
			body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; margin: 0; padding: 0; background-color: #fff; color: #111; }
			.container { max-width: 600px; margin: 0 auto; }
			.button { display: block; width: fit-content; margin: 8px auto; padding: 8px 16px; color: currentColor; text-decoration: none; border: 1px solid #ccc; border-radius: 8px; transition: border-color .15s; }
			.button:hover { border-color: currentColor; }
			hr { margin: 24px 0; border: none; border-top: 1px solid #ccc; }
			.link { word-break: break-all; color: #007bff; }
			small { color: #777; margin-top: 30px; text-align: center; }
		</style>
	</head>
	<body>
		<div class="container">
			<h2>Cryptiques - Connexion</h2>
			<p>Bonjour,</p>
			<p>Cliquez sur le bouton ci-dessous pour vous connecter. Ce lien expirera dans 1 heure.</p>
			<a href="${link}" target="_blank" class="button">Se connecter</a>
			<hr>
			<p>
				Si le bouton ne fonctionne pas, copiez et collez cette URL dans votre navigateur :<br>
				<span class="link">${link}</span>
			</p>
			<small>Si vous n'avez pas demandé ce message, vous pouvez l'ignorer.</small>
		</div>
	</body>
</html>
`,
	});
}