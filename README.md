# Roster — Contact Admin

Admin portal for managing employee contact profiles:

- Logo / photo upload
- Name & subtitle
- Position & department
- Work email
- Personal contact

## Run locally

Start backend first:

```bash
cd ../contact-backend
npm install
npm run dev
```

Then admin:

```bash
npm install
npm run dev
```

Open [http://localhost:3000/login](http://localhost:3000/login).

Default admin account:

```
Email:    admin@sandai.com
Password: Sandai@123
```

**Namecard flow**

1. Physical card: `http://localhost:3001/card/{slug}`
2. Scan QR → digital namecard: `http://localhost:3001/card/{slug}/digital`

Admin **QR code** (list or Edit) encodes the digital URL for print.

Admin proxies API calls to **contact-backend** (`http://localhost:4000`).

```bash
BACKEND_API_URL=http://localhost:4000
NEXT_PUBLIC_BACKEND_API_URL=http://localhost:4000
CONTACT_WEB_URL=http://localhost:3001
NEXT_PUBLIC_CONTACT_WEB_URL=http://localhost:3001
```
