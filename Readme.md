# HorizonPay

### Trustless Stablecoin Payment Infrastructure on Solana

HorizonPay is a production-oriented stablecoin payment infrastructure built on Solana that enables merchants to accept crypto payments with a modern developer experience.

The platform combines:

* on-chain settlement
* escrowed payment flows
* recurring subscriptions
* secure merchant onboarding
* webhook infrastructure
* scalable backend architecture

while ensuring merchant funds remain controlled by smart contract logic instead of backend custody.

---

# Features

## Stablecoin Payments

* Stripe-style checkout sessions
* Solana wallet integration
* Real-time payment confirmations
* Merchant webhooks
* Idempotent payment handling
* Transaction integrity validation

---

## Merchant Infrastructure

* Secure merchant onboarding
* API key management
* Merchant dashboards
* Transaction history
* Webhook configuration
* Escrowed withdrawals

---

## Recurring Payments

* Subscription-based billing
* Automated recurring payments
* Delegated payment authorization
* Subscription lifecycle management

---

## Escrow Settlement System

Payments are processed through an on-chain escrow mechanism before becoming withdrawable.

This architecture provides:

* deterministic settlement logic
* transparent accounting
* reduced trust assumptions
* safer merchant payouts

---

# Architecture

```text
Merchant Frontend
        │
        ▼
 HorizonPay Backend
 ├── API Layer
 ├── Webhooks
 ├── Event Listener
 └── Background Workers
        │
        ▼
  Solana Smart Contract
        │
        ▼
     PostgreSQL
```

---

# Tech Stack

## Smart Contract

* Rust
* Anchor Framework
* Solana Program Library (SPL)

## Backend

* Node.js
* TypeScript
* Express
* PostgreSQL
* Prisma ORM

## Frontend

* Next.js
* TypeScript
* Solana Wallet Adapter

---

# Repository Structure

```bash
contract/   # Solana smart contracts
backend/    # Backend services & APIs
frontend/   # Merchant dashboard & checkout UI
```

---

# Core Engineering Focus

HorizonPay was designed around a few key engineering principles:

## Trust-Minimized Architecture

The backend orchestrates transactions while smart contracts enforce fund movement and settlement rules.

## Fault-Tolerant Infrastructure

The system includes:

* background reconciliation
* event recovery handling
* webhook retry infrastructure
* resilient transaction processing

## Security-First Design

The platform uses:

* encrypted secret storage
* scoped API authentication
* transaction validation
* secure merchant onboarding flows

## Scalable Payment Processing

The backend architecture separates:

* API services
* event listeners
* scheduled workers

to improve operational reliability and scalability.

---

# Example Payment Flow

```text
Merchant Creates Checkout Session
            │
            ▼
Customer Connects Wallet
            │
            ▼
Transaction Signed
            │
            ▼
Smart Contract Executes Payment
            │
            ▼
Backend Detects Confirmation
            │
            ▼
Webhook Sent To Merchant
```

---

# Local Development

## Clone Repository

```bash
git clone https://github.com/yashwankhade5/horizonpay.git
cd horizonpay
```

---

## Smart Contract

```bash
cd contract

anchor build
anchor test
anchor deploy
```

---

## Backend

```bash
cd backend

yarn install
yarn run dev
```

---

## Frontend

```bash
cd frontend

yarn install
yarn run dev
```

---

# Future Improvements

* Multi-token support
* Advanced analytics dashboard
* Treasury reporting
* Multi-chain support
* SDK packages
* Fiat on/off ramp integrations

---

# Why This Project Matters

HorizonPay is designed as a real-world payment infrastructure system rather than a simple demo dApp.

The project demonstrates practical understanding of:

* blockchain infrastructure
* backend systems engineering
* distributed payment flows
* smart contract architecture
* scalability & reliability
* developer platform design

---

# Status

🚧 Currently in active development.

---

# License

MIT License

---

# Author

Built by yashwankhade5
