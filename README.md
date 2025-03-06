## Getting Started

1. Clone the repository:

```bash
git clone https://github.com/matan3sh/calendly.git
cd calendly-clone
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:

```bash
cp .env.example .env
```

4. Configure required services:

- Clerk Authentication
- Google Calendar API
- Neon Database

5. Run database migrations:

```bash
npm run db:generate
npm run db:migrate
```

6. Start the development server:

```bash
npm run dev
```

### Database Schema

The project uses a carefully designed schema for efficient data storage and
retrieval:

- Users and preferences
- Available time slots
- Booking records
- Calendar integrations

### API Integration

Seamless integration with external services:

- Google Calendar API for calendar synchronization
- Clerk API for authentication
- Email service for notifications
