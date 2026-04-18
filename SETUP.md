# Investment Platform - Setup Guide

## Quick Start

### 1. Environment Setup

Create a `.env` file in the project root with the following variables:

```env
# Database
DATABASE_URL=mysql://user:password@localhost:3306/investment_platform

# Manus OAuth
VITE_APP_ID=your-manus-app-id
OAUTH_SERVER_URL=https://api.manus.im
VITE_OAUTH_PORTAL_URL=https://oauth.manus.im
OWNER_OPEN_ID=your-owner-id
OWNER_NAME=Your Name

# JWT
JWT_SECRET=your-super-secret-jwt-key-min-32-chars

# Stripe (Optional - for payment processing)
STRIPE_SECRET_KEY=sk_test_xxxxx
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_xxxxx

# Manus Built-in APIs
BUILT_IN_FORGE_API_URL=https://api.manus.im
BUILT_IN_FORGE_API_KEY=your-api-key
VITE_FRONTEND_FORGE_API_KEY=your-frontend-key
VITE_FRONTEND_FORGE_API_URL=https://api.manus.im

# App Configuration
VITE_APP_TITLE=Exclusive Investment Platform
VITE_APP_LOGO=https://your-logo-url.com/logo.png
```

### 2. Database Setup

```bash
# Install dependencies
pnpm install

# Run database migrations
pnpm drizzle-kit migrate

# Verify database connection
pnpm dev
```

### 3. Seed Initial Data

Create `scripts/seed.ts`:

```typescript
import { getDb } from "../server/db";
import { investmentPlans, investmentCategories } from "../drizzle/schema";

async function seed() {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  // Seed Investment Plans
  await db.insert(investmentPlans).values([
    {
      name: "Starter",
      minAmount: "60",
      maxAmount: "500",
      roi: "12",
      duration: 90,
      description: "Perfect for new investors",
      features: JSON.stringify(["Basic support", "Email updates"]),
      displayOrder: 1,
      isActive: true,
    },
    {
      name: "Silver",
      minAmount: "500",
      maxAmount: "2000",
      roi: "18",
      duration: 180,
      description: "Enhanced features and support",
      features: JSON.stringify(["Priority support", "Monthly reports"]),
      displayOrder: 2,
      isActive: true,
    },
    {
      name: "Gold",
      minAmount: "2000",
      maxAmount: "5000",
      roi: "25",
      duration: 365,
      description: "Premium benefits",
      features: JSON.stringify(["24/7 support", "Quarterly reviews"]),
      displayOrder: 3,
      isActive: true,
    },
    {
      name: "Platinum",
      minAmount: "5000",
      roi: "35",
      duration: 365,
      description: "VIP treatment and exclusive opportunities",
      features: JSON.stringify(["Dedicated manager", "Custom strategies"]),
      displayOrder: 4,
      isActive: true,
    },
  ]);

  // Seed Investment Categories
  await db.insert(investmentCategories).values([
    {
      name: "Solana Meme Coins",
      description: "High-growth digital assets with significant upside potential",
      expectedYield: "45-60% APY",
      riskLevel: "high",
      displayOrder: 1,
      isActive: true,
    },
    {
      name: "Agricultural Investments",
      description: "Sustainable farming ventures with stable returns",
      expectedYield: "15-22% APY",
      riskLevel: "medium",
      displayOrder: 2,
      isActive: true,
    },
    {
      name: "Car Stocks",
      description: "Automotive industry growth opportunities",
      expectedYield: "18-28% APY",
      riskLevel: "medium",
      displayOrder: 3,
      isActive: true,
    },
  ]);

  console.log("✓ Database seeded successfully");
}

seed().catch(console.error);
```

Run with: `pnpm tsx scripts/seed.ts`

### 4. Development Server

```bash
# Start development server
pnpm dev

# Server runs on http://localhost:3000
# Frontend available at http://localhost:5173
```

### 5. Build for Production

```bash
# Build the application
pnpm build

# Start production server
pnpm start
```

## Configuration Details

### Manus OAuth Setup

1. Go to Manus Developer Dashboard
2. Create a new OAuth application
3. Set redirect URI to: `https://your-domain.com/api/oauth/callback`
4. Copy the App ID and configure in `.env`

### Stripe Setup

1. Create a Stripe account at https://stripe.com
2. Get API keys from Dashboard > API Keys
3. For testing, use test keys (sk_test_*, pk_test_*)
4. For production, use live keys (sk_live_*, pk_live_*)
5. Configure webhook endpoint: `/api/webhooks/stripe`

### Database Setup

#### MySQL
```bash
# Create database
mysql -u root -p
CREATE DATABASE investment_platform;
CREATE USER 'invest_user'@'localhost' IDENTIFIED BY 'secure_password';
GRANT ALL PRIVILEGES ON investment_platform.* TO 'invest_user'@'localhost';
FLUSH PRIVILEGES;
```

#### Connection String
```
DATABASE_URL=mysql://invest_user:secure_password@localhost:3306/investment_platform
```

## Deployment

### Manus Platform

1. Create a checkpoint in the Manus UI
2. Click "Publish" button
3. Configure custom domain if needed
4. Set environment variables in Settings > Secrets

### Docker Deployment

```dockerfile
FROM node:22-alpine

WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install

COPY . .

RUN pnpm build

EXPOSE 3000

CMD ["pnpm", "start"]
```

Build and run:
```bash
docker build -t investment-platform .
docker run -p 3000:3000 --env-file .env investment-platform
```

## Troubleshooting

### Port Already in Use
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9
```

### Database Connection Error
```bash
# Test connection
mysql -u invest_user -p -h localhost investment_platform
```

### OAuth Redirect Issues
- Verify callback URL matches in Manus dashboard
- Check VITE_APP_ID is correct
- Ensure cookies are enabled in browser

### Stripe Integration Issues
- Verify API keys are correct
- Check webhook endpoint is accessible
- Review Stripe logs in dashboard

## Development Workflow

1. **Create feature branch**
   ```bash
   git checkout -b feature/new-feature
   ```

2. **Make changes**
   - Update database schema if needed
   - Run migrations: `pnpm drizzle-kit migrate`
   - Add API procedures in `server/routers.ts`
   - Build UI components in `client/src/pages/`

3. **Test changes**
   ```bash
   pnpm test
   ```

4. **Commit and push**
   ```bash
   git add .
   git commit -m "Add new feature"
   git push origin feature/new-feature
   ```

5. **Create pull request**

## Performance Tuning

### Database Optimization
- Add indexes to frequently queried columns
- Use pagination for large result sets
- Cache investment plans and categories

### Frontend Optimization
- Code splitting with React.lazy()
- Image optimization with next/image
- CSS minification with Tailwind

### API Optimization
- Use tRPC batching
- Implement caching strategies
- Monitor query performance

## Monitoring

### Logs
- Server logs: `.manus-logs/devserver.log`
- Client logs: `.manus-logs/browserConsole.log`
- Network logs: `.manus-logs/networkRequests.log`

### Metrics
- Use Manus analytics dashboard
- Monitor database performance
- Track API response times

## Security Checklist

- [ ] Change default JWT_SECRET
- [ ] Use HTTPS in production
- [ ] Enable database SSL
- [ ] Configure CORS properly
- [ ] Set secure cookie flags
- [ ] Validate all user inputs
- [ ] Implement rate limiting
- [ ] Regular security audits
- [ ] Keep dependencies updated
- [ ] Use environment variables for secrets

## Support

For issues and questions:
1. Check the main README.md
2. Review error logs
3. Check Manus documentation
4. Contact support team
