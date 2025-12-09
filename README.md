# UFO Link Shortener 🛸

A powerful, self-hosted link shortener built with SvelteKit and Cloudflare D1.

## Features ✨

- **Shorten Links**: Create custom slugs or generate random ones.
- **Analytics**: Track clicks, location (Country/City), device type, OS, and browser.
- **Authentication**: Secure user accounts with password hashing (PBKDF2) and JWT sessions.
- **Admin Dashboard**: manage users, ban links/domains, and view system stats.
- **QR Codes**: Generate QR codes for any short link.
- **My Links**: Manage your personal links, edit destinations, or delete them.
- **Cloudflare D1**: Runs entirely on the edge with Cloudflare Workers and D1 Database.

## TODO 
- Implement Max users
- Implement Max links per user

## Technology Stack 🛠️

- **Framework**: SvelteKit
- **Database**: Cloudflare D1 (SQLite on Edge)
- **ORM**: Drizzle ORM
- **Styling**: Tailwind CSS
- **Runtime**: Cloudflare Workers

## Self-Hosting Guide 🚀

Follow these steps to deploy your own instance of UFO Link Shortener.

### 1. Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later)
- [Cloudflare Account](https://dash.cloudflare.com/sign-up)
- [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/install-and-update/): `npm install -g wrangler`

### 2. Setup

Clone the repository and install dependencies:

```bash
git clone https://github.com/xanthisafk/cf-redirect-svelte.git
cd cf-redirect-svelte
npm install
```

### 3. Database Setup (Cloudflare D1)

1.  **Create a D1 Database**:
    ```bash
    npx wrangler d1 create cf-redirect
    ```
    *Copy the `database_id` from the output.*

2.  **Configure `wrangler.jsonc`**:
    - Copy the demo config:
      ```bash
      cp wrangler.jsonc.demo wrangler.jsonc
      ```
    - Open `wrangler.jsonc` and replace `Your <database_id> goes here` with the ID you just generated.

3.  **Apply Migrations**:
    Create the necessary tables in your remote D1 database:
    ```bash
    npx wrangler d1 migrations apply cf-redirect --remote
    ```
    *(For local development, use `--local` flag).*

### 4. Environment Variables

Open `wrangler.jsonc` and update the `vars` section with your secrets and configuration:

```jsonc
"vars": {
    "JWT_SECRET": "generate-a-long-random-string-here", 
    "PROMO_MODE": "public", // 'public' or 'private'
    "MAX_USERS": "100",
    "MAX_LINKS_PER_USER": "50",
    // Analytics Features
    "TRACK_LOCATION": "true",
    "TRACK_DEVICE": "true",
    "TRACK_OS": "true",
    "TRACK_BROWSER": "true",
    "TRACK_REFERRER": "true"
}
```

> **Security Note**: Never commit your real `wrangler.jsonc` or `.env` files to version control if they contain secrets.

### 5. Deployment

Deploy your application to Cloudflare Workers:

```bash
npm run deploy
```

Your app will be live at `https://cf-redirect.<your-subdomain>.workers.dev` (or your custom domain).

## Local Development 💻

To run the application locally (using a local D1 emulator):

1.  **Apply Local Migrations**:
    ```bash
    npx wrangler d1 migrations apply cf-redirect --local
    ```

2.  **Start Preview Server**:
    ```bash
    npm run preview --remote
    # OR for purely local dev (requires build):
    npm run build && wrangler dev
    ```

## CLI Commands

| Command | Description |
| :--- | :--- |
| `npm run dev` | Start Vite dev server (frontend only, may lack D1 context) |
| `npm run preview --remote` | Build and run with Miniflare (simulates Worker env) |
| `npm run deploy` | Deploy to Cloudflare |
| `npx wrangler d1 migrations apply cf-redirect --local` | Update local database schema |
| `npx wrangler d1 migrations apply cf-redirect --remote` | Update remote database schema |

## License

MIT
