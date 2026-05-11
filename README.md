# Cryptiques

Site expliquant et listant des énigmes cryptiques en français.

Note: une grande partie du code et les instructions ci-dessous sont en anglais.

-----

Site about cryptic clues in French. If you don't speak French, this is probably not for you, sorry.

## Development

Ensure you have the dependencies installed
```bash
npm install
```

Create a secrets file called `secrets.js` at root:
```js
export default {
	// secret used to encode things like sessions and sign jwts (>= 32 chars)
	secretKey: 'SECRET_STRING',
	// omit to use pglite
	db: 'DB_CONNECTION_STRING',
	// keys for all desired oauth services, supported by nuxt-auth-utils (any defined auth will be shown as a log in option - make sure it also has a file in server/routes/auth)
	oauth: {
		github: {
			clientId: 'GITHUB_CLIENT_ID',
			clientSecret: 'GITHUB_SECRET_KEY',
		},
		// ...
	},
	// nodemailer configuration (connection string or configuration object)
	emailTransport: {
		secure: true,
		host: 'SMTP_HOST',
		auth: { user: 'SMTP_USERNAME', pass: 'SMTP_PASSWORD' },
	},
};
```

Start the development server on `http://localhost:3000`:

```bash
npm run dev
```

When changing the database schema, run:
```bash
npx nuxt db generate
```

## Production

Make sure you have a secrets file set up (see development instructions).

Pull, update dependencies, then build the application for production:

```bash
npm run build
```

Or all-in-one
```bash
npm run prod
```

This uses Nuxt. Check out their [deployment documentation](https://nuxt.com/docs/getting-started/deployment) (this is likely not relevant to you unless you're hosting a mirror).
