## [7.0.0] - 18-04-2026

### Changed

- Replaced the HashRouter with the BrowserRouter.
- Changed the precision of the currency from 100,000,000 to 100, and the circulation cap to 21,000,000,000,000.

## [6.0.0] - 25-03-2026

### Added

- Supply-table on the database, from which funds are drawn into new accounts.
- The HelperMessage-component, and variants.
- Email verification on registration.
- App logo onto the landing page.
- Error message when trying to register non-gmail emails.
- Display SessionLoadingScreen when navigating to the auth-section, and the users session has not loaded yet.

### Changed

- Dropped account signatures.
- Colors of HelperMessage-components.
- The location of the ErrorMessage rendered on the send-screen.
- Updated back-end currency precision to 100 million.
- Made the aneds of inputs and buttons fully rounded.
- Made sure the send-button is disabled after sending money succeeds.

### Fixed

- The "Something went wrong" message flashing briefly when a transaction succeeds.

## [5.0.0] - 18-03-2026

### Added

- New icon.
- favicon.ico
- The static Core-class containing the global fractions a single mark is divided into, and methods to convert cents to whole marks, and string representations.
- Migration utility functions for creating signatures, and updating the signatures of accounts.
- Guard against excess decimals on the receive screen amount input.

### Changed

- App name to e-MRK.
- Send-screen appearance.
- Receive-screen appearance.
- AppScreen-component details, like the default background color, to slate-50
- Added white background to inputs.

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
