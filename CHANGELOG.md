## [1.1.0] - 03-03-2026

### Added

- This changelog.
- Repo-classes for the server.
- Descriptions for functions in the CoinBatch-class.

### Changed

- Sorted transactions by date received on the web-app.
- Increased the padding of inputs.
- Moved the id-field on the transaction-screen to the top of the modal.
- Moved circulation calculation inside the TokenRepo.
- Moved logic for fetching tokens owned by a user under the TokenRepo-class.
- Renamed getCirculation to getCirculationHandler.
- Renamed getUserTokens to getUserTokensHandler.
- Renamed getAccount to getAccountHandler.

### Removed

- The unused createAccount-handler.

### Deprecated

- The getTokens helper-function; it is now handled by a method of the TokenRepo.
