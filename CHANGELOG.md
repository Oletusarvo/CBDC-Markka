## [4.0.0] - 15-03-2026

### Added

- A bottom navigation bar.
- A credit-card-like visualization of the account on the send screen.
- Icons on the manual input and qr code scan tab-buttons.

### Changed

- Rearranged the routes.
- Changed the currency symbol to "mk" everywhere but the main wallet balance- and the circulation display.
- The appearance of transaction cards.
- The color of sent money on the transaction cards.
- The arrangement of the wallet balance display and logout button.

## [3.0.0] - 13-03-2026

### Added

- Currency symbol
- Legal tender notice on index-page.

### Changed

- Transaction error messages to have the same word order.

## [2.1.0] - 12-03-2026

### Added

- Caching for the user's session and account, used when the server doesn't respond fast enough.
- Functionality to copy to clipboard the senders/recipient's ID on the transaction screen.
- Optional icons for inputs.
- Account signatures.
- Transaction nonce checking.

### Changed

- All api-calls the app can make are now in the ApiInterface-class.
- Updated the previous log to contain the icons on all buttons as a change.
- Send and Receive screens.
- Money is now sent by the account id instead of the users email.
- The transaction screen appearance.
- Currency introduction text.

## [2.0.0] - 04-03-2026

### Added

- Qr-code reading for sending money.
- Symbol for the currency.

### Changed

- Moved Providers and api-logic inside their won packages so they can be shared between a possible react-native app and the web app in the future.
- Switched to an account-based model.
- The readme to reflect the account-based model.
- Account balance and transactions are now loaded at the same time.
- Added icons to buttons.

### Removed

- Token-related stuff from the readme.

## [1.1.0] - 03-03-2026

### Added

- This changelog.
- Repo-classes for the server.
- Descriptions for functions in the CoinBatch-class.
- TransactionManager-class.
- Indicator on the tokens wether they are spendable, restricted or expired.

### Changed

- Sorted transactions by date received on the web-app.
- Increased the padding of inputs.
- Moved the id-field on the transaction-screen to the top of the modal.
- Moved circulation calculation inside the TokenRepo.
- Moved logic for fetching tokens owned by a user under the TokenRepo-class.
- Renamed getCirculation to getCirculationHandler.
- Renamed getUserTokens to getUserTokensHandler.
- Renamed getAccount to getAccountHandler.
- Moved the minting function under the CoinBatch-class.

### Removed

- The unused createAccount-handler.

### Deprecated

- The getTokens helper-function; it is now handled by a method of the TokenRepo.
