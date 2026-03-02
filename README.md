# CBDC Markka

**CBDC Markka** is a centralized digital currency inspired by the Finnish markka. Unlike standard account-based systems, it represents balances as **tokenized denominations**, similar to digital cash.

## Concept

Accounts hold discrete tokens instead of a single numeric balance:

Account A tokens:

10 × 100 Mark

5 × 50 Mark

2 × 10 Mark

5 × 1 Mark

Each token has:

- A fixed denomination
- A unique ID
- Ownership recorded on a central ledger

For users, tokens are **abstracted**: they simply enter an amount, and the system automatically selects the appropriate tokens for the transaction.

## Benefits

- **Cash-like model:** Balances are compositions of units rather than abstract numbers.
- **Traceable flow:** Tokens can be tracked, frozen, or expired individually.
- **Flexible policies:** Enables denomination-based rules, demurrage, or targeted distributions.

## System Overview

Components:

- **Central Issuer:** creates/destroys tokens
- **Ledger Authority:** tracks token ownership
- **Accounts:** hold token sets
- **Transfer Engine:** moves tokens automatically
- **Policy Layer:** optional rules for monetary experiments

All operations work with discrete token sets; fractional balances are not used internally.

## Example Transfer

To send 130 Mark:

1. User inputs `130`
2. Server automatically selects tokens (e.g., 100 + 20 + 10)
3. Ownership is reassigned behind the scenes
