## [2.0.0] - 04-03-2026

### Changed

- Moved Providers and api-logic inside their won packages so they can be shared between a possible react-native app and the web app in the future.
- Switched to an account-based model.

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
