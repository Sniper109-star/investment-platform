# Investment Platform TODO

## Database & Schema
- [ ] Create users table with admin role
- [ ] Create investment_plans table (Starter, Silver, Gold, Platinum)
- [ ] Create investment_categories table (Solana Meme Coins, Agricultural Investments, Car Stocks)
- [ ] Create user_investments table
- [ ] Create withdrawal_requests table
- [ ] Create admin_logs table for audit trail

## Authentication & Core
- [ ] Setup Manus OAuth integration
- [ ] Create protected procedures for authenticated users
- [ ] Create admin procedures with role-based access control
- [ ] Implement logout functionality

## Landing Page
- [ ] Create hero section with premium design (gold/navy/ivory)
- [ ] Create investment plans section (4 plans with ROI, duration, features)
- [ ] Create investment categories section (Solana, Agricultural, Car Stocks)
- [ ] Create features/benefits section
- [ ] Create call-to-action buttons

## User Dashboard
- [ ] Create dashboard layout with sidebar navigation
- [ ] Create portfolio overview page (total invested, total earnings)
- [ ] Create active investments page
- [ ] Create investment history page
- [ ] Create earnings summary page
- [ ] Create withdrawal request feature

## Investment Purchase Flow
- [ ] Create plan selection page
- [ ] Create category selection page
- [ ] Create amount input page
- [ ] Create investment confirmation page
- [ ] Create Stripe payment integration
- [ ] Create order/investment record creation

## Multi-Language Support
- [ ] Setup i18n library (react-i18next or similar)
- [ ] Create translation files for all 5 languages (EN, FR, ES, PT, AR)
- [ ] Create language switcher component in navbar
- [ ] Translate all UI text and content

## Stripe Integration
- [ ] Setup Stripe API keys and environment variables
- [ ] Create Stripe checkout flow
- [ ] Create payment webhook handler
- [ ] Create order confirmation after payment

## Admin Panel
- [ ] Create admin authentication check
- [ ] Create admin dashboard with statistics
- [ ] Create user management page
- [ ] Create investment management page
- [ ] Create withdrawal request approval page
- [ ] Create platform statistics/analytics page

## Design Assets (Canva)
- [ ] Create hero banner image
- [ ] Create plan card designs
- [ ] Create category banner images
- [ ] Export all assets and integrate into website

## Testing & Quality
- [ ] Write vitest tests for auth procedures
- [ ] Write vitest tests for investment procedures
- [ ] Write vitest tests for admin procedures
- [ ] Test multi-language switching
- [ ] Test payment flow

## GitHub & Documentation
- [ ] Initialize GitHub repository
- [ ] Push all code to GitHub
- [ ] Create comprehensive README with:
  - [ ] Project overview
  - [ ] Feature descriptions
  - [ ] Setup instructions
  - [ ] Environment variables
  - [ ] Database schema
  - [ ] Deployment guidance
  - [ ] API documentation

## Final Deployment
- [ ] Create checkpoint before publishing
- [ ] Publish to Manus hosting
- [ ] Verify all features working
