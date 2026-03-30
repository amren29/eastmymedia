# Pricing Download Feature Setup

This document explains how to set up and use the pricing download feature where clients can request pricing information.

## Overview

The pricing download feature allows clients to:
1. Click a "Download Pricing" button
2. Fill out a form with their contact information (name, email, phone, company)
3. Submit the form which sends the information to admin@eastmymedia.my
4. Your team receives the notification and can follow up with the client

## Setup Instructions

### 1. Configure Email Service

You need to set up an email service to send emails. We support two options:

#### Option A: Resend (Recommended)

1. Sign up at https://resend.com
2. Verify your domain (eastmymedia.com)
3. Get your API key
4. Add to your `.env.local`:
   ```
   RESEND_API_KEY=re_xxxxxxxxxxxxx
   ```

#### Option B: SendGrid

1. Sign up at https://sendgrid.com
2. Verify your domain
3. Get your API key
4. Add to your `.env.local`:
   ```
   SENDGRID_API_KEY=SG.xxxxxxxxxxxxx
   ```

### 2. Update Email Sender

In `src/app/api/pricing-request/route.ts`, update the `from` email address:

```typescript
from: 'noreply@eastmymedia.com', // Change this to your verified domain email
```

**Important**: The sender email must be verified with your email service provider.

### 3. Testing Without Email Service

If you haven't set up an email service yet, the feature will still work but will only log the request to the console. You'll see:

```
==================================================
PRICING REQUEST (No Email Service Configured)
==================================================
[Client details will be shown here]
==================================================
⚠️  No email service configured. Please add RESEND_API_KEY or SENDGRID_API_KEY to .env.local
```

## Usage

### Basic Usage

The button is already integrated in the Hero section on the home page. To use it in other pages:

```tsx
import { PricingDownloadForm } from '@/components/PricingDownloadForm';

// In your component
<PricingDownloadForm />
```

### Custom Styling

```tsx
<PricingDownloadForm
  buttonText="Get Pricing Information"
  buttonVariant="default"
  buttonSize="lg"
  className="my-custom-class"
/>
```

### Props

- `buttonText` (optional): Custom text for the button (default: "Download Pricing")
- `buttonVariant` (optional): Button style - "default" | "outline" | "secondary" | "ghost" | "link"
- `buttonSize` (optional): Button size - "default" | "sm" | "lg" | "icon"
- `className` (optional): Additional CSS classes

## Email Format

When a client submits the form, your admin email (admin@eastmymedia.my) will receive:

**Subject**: New Pricing Request from [Client Name] - [Company Name]

**Body**:
```
New Pricing Request Received

Client Details:
- Name: John Doe
- Email: john@company.com
- Phone: +60 12-345 6789
- Company: ABC Corporation

Request Date: [Date and Time in Malaysia timezone]

Please review and send the pricing information to the client.
```

## API Endpoint

The form submits to: `POST /api/pricing-request`

**Request Body**:
```json
{
  "name": "John Doe",
  "email": "john@company.com",
  "phone": "+60 12-345 6789",
  "company": "ABC Corporation"
}
```

**Response**:
```json
{
  "success": true,
  "message": "Pricing request submitted successfully"
}
```

## Troubleshooting

### Email not sending

1. Check that your API key is correct in `.env.local`
2. Verify that your sender domain is verified with your email provider
3. Check the server console for error messages
4. Make sure you've restarted the dev server after adding environment variables

### Form validation errors

The form validates:
- All fields are required
- Email must be in valid format (name@domain.com)

### Client doesn't receive confirmation

Currently, the client sees a browser alert confirming submission. If you want to send a confirmation email to the client as well, you can modify the API endpoint to send two emails - one to admin and one to the client.

## Next Steps

1. Set up your email service (Resend or SendGrid)
2. Verify your domain
3. Update the sender email in the API route
4. Test the complete flow
5. Optionally customize the email template in the API route

## Files Created/Modified

- `src/components/PricingDownloadForm.tsx` - Main form component
- `src/components/ui/dialog.tsx` - Dialog/modal component
- `src/app/api/pricing-request/route.ts` - API endpoint
- `src/components/home/Hero.tsx` - Hero section with button integrated
- `.env.local.example` - Environment variable examples
