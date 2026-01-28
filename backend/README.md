# AcadVizen Digital Hub - Backend

This folder contains the production-ready backend services and database migrations for the AcadVizen Digital Marketing Student Portal.

## Structure

```
backend/
├── migrations/           # SQL migration files for Supabase
│   ├── 000_complete_schema.sql  # Complete schema (run this in Supabase)
│   ├── 001_create_profiles_table.sql
│   ├── 002_create_courses_table.sql
│   ├── 003_create_modules_table.sql
│   ├── 004_create_content_tables.sql
│   ├── 005_create_enrollments_table.sql
│   ├── 006_create_payments_table.sql
│   ├── 007_create_progress_tracking.sql
│   ├── 008_create_registrations_table.sql
│   └── 009_create_notifications_table.sql
├── services/             # Backend service modules
│   ├── registrationService.ts   # Student registration with validation
│   ├── adminService.ts          # Admin CRUD operations
│   ├── emailService.ts          # Email notifications
│   ├── paymentService.ts        # Razorpay payment integration
│   ├── googleSheetsService.ts   # Google Sheets sync
│   ├── studentDashboardService.ts # Student dashboard data
│   └── index.ts                 # Service exports
└── README.md
```

## Database Setup

1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Copy the contents of `migrations/000_complete_schema.sql`
4. Paste and run the SQL

This will create all necessary tables with:
- Row Level Security (RLS) policies
- Indexes for performance
- Triggers for automatic timestamps
- Functions for ID generation

## Tables Overview

| Table | Description |
|-------|-------------|
| profiles | Extended user profiles (linked to auth.users) |
| courses | Course information |
| modules | Course modules/chapters |
| videos | Video content for modules |
| pdfs | PDF materials for modules |
| tools | Marketing tools catalog |
| enrollments | Student-course enrollments |
| payments | Payment records (Razorpay integration) |
| progress | Student learning progress |
| certificates | Issued certificates |
| registrations | Pending registration requests |
| notifications | User notifications |
| email_logs | Email sending history |

## Environment Variables

Set these in your Replit Secrets or `.env` file:

```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key

# Optional: For server-side operations
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Optional: For Razorpay
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret

# Optional: For Google Sheets
GOOGLE_SHEETS_ID=your_google_sheet_id
GOOGLE_SERVICE_ACCOUNT_EMAIL=your_service_account_email
GOOGLE_PRIVATE_KEY=your_private_key

# Optional: For Email (Resend/SendGrid)
EMAIL_API_KEY=your_email_api_key
EMAIL_FROM=noreply@yourdomain.com
```

## Service Usage

### Registration Service

```typescript
import { createRegistration, validateRegistration, confirmRegistration } from '@/backend/services';

// Create a new registration
const result = await createRegistration({
  name: 'John Doe',
  email: 'john@example.com',
  phone: '+1234567890',
  mode: 'online'
});

// Confirm registration (admin only)
const confirmation = await confirmRegistration(registrationId, adminId);
```

### Admin Service

```typescript
import { createEntity, updateEntity, deleteEntity, getEntities } from '@/backend/services';

// Create a course
await createEntity('courses', {
  title: 'Digital Marketing Masterclass',
  slug: 'dm-masterclass',
  price: 9999
});

// Get all students
const students = await getEntities('profiles', {
  filters: { role: 'student' },
  orderBy: 'created_at'
});
```

### Payment Service

```typescript
import { createPaymentOrder, verifyPayment, recordManualPayment } from '@/backend/services';

// Create Razorpay order
const order = await createPaymentOrder({
  studentId: 'uuid',
  amount: 9999,
  currency: 'INR'
}, razorpayConfig);

// Verify payment callback
await verifyPayment(razorpayCallbackData, razorpayConfig);

// Record manual/offline payment
await recordManualPayment({
  studentId: 'uuid',
  amount: 9999,
  paymentMode: 'bank_transfer',
  transactionId: 'TXN123'
});
```

## Google Sheets Integration

The system can sync registrations to Google Sheets for the sales team:

1. Create a Google Cloud project
2. Enable Google Sheets API
3. Create a service account
4. Share your Google Sheet with the service account email
5. Add credentials to environment variables

Registrations will be automatically synced, and when sales team marks a row as "confirmed", a webhook can trigger student account creation.

## Security Features

- Row Level Security (RLS) on all tables
- Role-based access control (student, admin, instructor)
- Secure password generation for new accounts
- Payment signature verification
- Input validation on all forms

## Production Deployment

1. Run the SQL migrations in Supabase
2. Set all environment variables
3. Configure Supabase Auth settings
4. Set up email templates in Supabase
5. Configure Razorpay webhooks (if using)
6. Set up Google Sheets webhook (if using)

## API Endpoints (if using Edge Functions)

You can create Supabase Edge Functions for:
- `/api/register` - Public registration endpoint
- `/api/payment/create-order` - Create payment order
- `/api/payment/verify` - Verify payment
- `/api/sheets/webhook` - Google Sheets webhook handler
