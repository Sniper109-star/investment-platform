# Exclusive Investment Platform

A premium, high-quality investment platform featuring exclusive opportunities in Solana meme coins, agricultural investments, and car stocks. Built with React, TypeScript, Express, tRPC, and Stripe payment processing.

## Features

### Core Features
- **Premium Design**: Classic gold, navy, and ivory color palette for an exclusive, high-end feel
- **User Authentication**: Manus OAuth integration with role-based access control (user/admin)
- **Investment Plans**: Four tiered plans (Starter $60, Silver, Gold, Platinum) with varying ROI and durations
- **Investment Categories**: Three distinct investment sectors:
  - Solana Meme Coins (45-60% APY)
  - Agricultural Investments (15-22% APY)
  - Car Stocks (18-28% APY)

### User Dashboard
- Portfolio overview with total invested and earnings
- Active investments tracking
- Investment history
- Withdrawal request management
- Real-time earnings summary

### Payment Processing
- Stripe integration for secure payment handling
- Investment purchase flow with plan selection, category choice, and amount entry
- Payment confirmation and order tracking

### Multi-Language Support
- Supported languages: English, French, Spanish, Portuguese, Arabic
- Language switcher in navigation bar
- Complete UI translation coverage

### Admin Panel
- User management and statistics
- Investment monitoring and approval
- Withdrawal request approval/rejection
- Platform analytics and statistics

### Design Assets
- Canva-designed hero banners, plan cards, and category banners
- Premium visual elements integrated throughout the platform
- Responsive design for all devices

## Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS 4, Vite
- **Backend**: Express 4, tRPC 11, Node.js
- **Database**: MySQL/TiDB with Drizzle ORM
- **Authentication**: Manus OAuth
- **Payments**: Stripe
- **Hosting**: Manus Platform

## Project Structure

```
investment-platform/
├── client/
│   ├── src/
│   │   ├── pages/          # Page components
│   │   ├── components/     # Reusable UI components
│   │   ├── contexts/       # React contexts
│   │   ├── hooks/          # Custom hooks
│   │   ├── lib/            # Utilities (tRPC client)
│   │   ├── App.tsx         # Main app with routing
│   │   ├── main.tsx        # React entry point
│   │   └── index.css       # Global styles
│   └── public/             # Static assets
├── server/
│   ├── db.ts               # Database queries
│   ├── routers.ts          # tRPC procedures
│   ├── _core/              # Framework infrastructure
│   └── auth.logout.test.ts # Test example
├── drizzle/
│   ├── schema.ts           # Database schema
│   └── migrations/         # SQL migrations
├── shared/
│   ├── translations.ts     # Multi-language translations
│   └── const.ts            # Shared constants
└── package.json            # Dependencies
```

## Database Schema

### Users Table
- Stores user profiles with Manus OAuth integration
- Tracks total invested and total earnings
- Role-based access (user/admin)

### Investment Plans Table
- Four plans: Starter, Silver, Gold, Platinum
- Configurable minimum/maximum amounts
- ROI percentage and duration
- Feature descriptions

### Investment Categories Table
- Solana Meme Coins
- Agricultural Investments
- Car Stocks
- Expected yield and risk levels

### User Investments Table
- Tracks individual investments
- Links users to plans and categories
- Stores investment amount and expected return
- Stripe payment ID for transaction tracking
- Investment status (pending, active, completed, withdrawn)

### Withdrawal Requests Table
- User withdrawal requests
- Admin approval/rejection workflow
- Audit trail with admin notes

### Admin Logs Table
- Complete audit trail of admin actions
- User and investment tracking

## Environment Variables

### Required for Development
```
DATABASE_URL=mysql://user:password@host/database
JWT_SECRET=your-jwt-secret
VITE_APP_ID=your-manus-app-id
OAUTH_SERVER_URL=https://api.manus.im
VITE_OAUTH_PORTAL_URL=https://oauth.manus.im
```

### Stripe Integration
```
STRIPE_SECRET_KEY=sk_live_xxxxx
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_xxxxx
```

### Built-in Manus APIs
```
BUILT_IN_FORGE_API_URL=https://api.manus.im
BUILT_IN_FORGE_API_KEY=your-api-key
VITE_FRONTEND_FORGE_API_KEY=your-frontend-key
VITE_FRONTEND_FORGE_API_URL=https://api.manus.im
```

## Setup Instructions

### Prerequisites
- Node.js 22+
- pnpm package manager
- MySQL/TiDB database
- Stripe account (for payment processing)

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd investment-platform
```

2. **Install dependencies**
```bash
pnpm install
```

3. **Set up environment variables**
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. **Initialize database**
```bash
pnpm drizzle-kit migrate
```

5. **Start development server**
```bash
pnpm dev
```

The application will be available at `http://localhost:3000`

## API Routes

### Authentication
- `GET /api/oauth/callback` - OAuth callback handler
- `POST /api/trpc/auth.logout` - User logout

### Investment Plans
- `GET /api/trpc/plans.list` - Get all active plans
- `GET /api/trpc/plans.getById` - Get plan details

### Investment Categories
- `GET /api/trpc/categories.list` - Get all categories
- `GET /api/trpc/categories.getById` - Get category details

### User Investments
- `GET /api/trpc/investments.list` - Get user's investments
- `POST /api/trpc/investments.create` - Create new investment

### Withdrawal Requests
- `GET /api/trpc/withdrawals.list` - Get user's withdrawal requests
- `POST /api/trpc/withdrawals.create` - Create withdrawal request
- `GET /api/trpc/withdrawals.getPending` - Get pending requests (admin)
- `POST /api/trpc/withdrawals.approve` - Approve withdrawal (admin)
- `POST /api/trpc/withdrawals.reject` - Reject withdrawal (admin)

## Investment Plans Details

### Starter Plan
- Minimum Investment: $60
- ROI: 12%
- Duration: 3 months
- Perfect for new investors

### Silver Plan
- Minimum Investment: $500
- ROI: 18%
- Duration: 6 months
- Enhanced features and support

### Gold Plan
- Minimum Investment: $2,000
- ROI: 25%
- Duration: 12 months
- Premium benefits

### Platinum Plan
- Minimum Investment: $5,000+
- ROI: 35%
- Duration: 12 months
- VIP treatment and exclusive opportunities

## Investment Categories

### Solana Meme Coins
- Expected Yield: 45-60% APY
- Risk Level: High
- High-growth digital assets with significant upside potential

### Agricultural Investments
- Expected Yield: 15-22% APY
- Risk Level: Medium
- Sustainable farming ventures with stable returns

### Car Stocks
- Expected Yield: 18-28% APY
- Risk Level: Medium-High
- Automotive industry growth opportunities

## Payment Processing

The platform uses Stripe for secure payment processing:

1. User selects investment plan and category
2. Enters investment amount
3. Reviews investment details
4. Proceeds to Stripe checkout
5. Payment confirmation triggers investment creation
6. Investment status changes from "pending" to "active"

## Multi-Language Support

The platform supports five languages with complete UI translation:
- English (en)
- French (fr)
- Spanish (es)
- Portuguese (pt)
- Arabic (ar)

Language selection is available in the navigation bar and persists across sessions.

## Admin Panel

Admins have access to:
- User management and statistics
- Investment monitoring
- Withdrawal request approval workflow
- Platform analytics
- Audit logs

Admin access is granted through role assignment in the database.

## Testing

Run the test suite:
```bash
pnpm test
```

Tests are located in `server/*.test.ts` files and use Vitest.

## Building for Production

```bash
pnpm build
pnpm start
```

The application will be optimized and ready for deployment.

## Deployment

The platform is designed for deployment on the Manus hosting platform:

1. Create a checkpoint in the Manus UI
2. Click the "Publish" button
3. The application will be deployed automatically
4. Access via the provided domain

For custom domains, configure them in the Manus dashboard.

## Security Considerations

- All user data is encrypted in transit (HTTPS)
- Passwords are handled by Manus OAuth (no local password storage)
- Stripe handles all payment data securely (PCI DSS compliant)
- Admin operations are logged for audit trails
- Role-based access control prevents unauthorized operations

## Performance Optimization

- React 19 with automatic batching
- Tailwind CSS 4 for optimized styling
- tRPC for type-safe API calls
- Database query optimization with Drizzle ORM
- Vite for fast development and optimized builds

## Troubleshooting

### Database Connection Issues
- Verify DATABASE_URL is correct
- Check database credentials
- Ensure database server is running

### OAuth Errors
- Verify VITE_APP_ID and OAUTH_SERVER_URL
- Check OAuth callback URL configuration
- Ensure cookies are enabled

### Stripe Payment Failures
- Verify Stripe API keys are correct
- Check Stripe account is in live mode
- Ensure webhook endpoints are configured

## Contributing

1. Create a feature branch
2. Make your changes
3. Write tests for new features
4. Submit a pull request

## License

MIT License - See LICENSE file for details

## Support

For support and questions:
- Check the documentation
- Review existing issues
- Contact the development team

## Canva Design Assets

The platform includes premium design assets created in Canva:
- Hero banner with gold/navy/ivory color scheme
- Investment plan cards with ROI and duration details
- Category banners for each investment type
- All assets are responsive and mobile-friendly

Design ID: DAHHMKRy0gg (Canva)

## Future Enhancements

- Mobile app (React Native)
- Advanced portfolio analytics
- Automated investment recommendations
- Social features and community
- API for third-party integrations
- Advanced reporting and tax documents
- Cryptocurrency integration
- Real-time market data feeds

## Changelog

### Version 1.0.0
- Initial release
- Core investment platform features
- Stripe payment integration
- Multi-language support
- Admin panel
- Premium design with Canva assets
