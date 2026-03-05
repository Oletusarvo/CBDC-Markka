# CBDC Markka

**CBDC Markka** is an experimental centralized digital currency inspired by the historical Finnish markka. The project explores how a modern central bank digital currency (CBDC) could function using a simple **account-based ledger model** and modern mobile payment flows.

Each user has an account with a balance maintained by a central server. Transactions update balances directly, with the server acting as the authoritative ledger and validating transfers between accounts.

The system supports **QR-code based payment requests**, allowing users to easily send and receive money. A recipient can generate a QR code that includes their account identifier and the amount they wish to receive. When another user scans the QR code, the payment interface automatically fills in the recipient and requested amount, allowing the sender to quickly confirm the transaction.

## Features

- **Account-Based Ledger**
  Each user has a balance stored on a centralized ledger.

- **Central Transaction Verification**
  The server validates transfers and updates account balances.

- **QR Code Payment Requests**
  Users can generate QR codes containing their account and a requested payment amount. Scanning the QR code automatically prepares the payment for the sender.

- **Mobile-Friendly Interface**
  Designed to work smoothly on mobile devices with camera access for QR scanning.

## Purpose

CBDC Markka is a technical experiment exploring how centralized digital currencies could be implemented with modern web technologies. The project focuses on payment flows, account-based settlement, and user-friendly peer-to-peer transfers.
