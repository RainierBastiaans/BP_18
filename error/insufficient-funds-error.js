class InsufficientFundsError extends Error {
  constructor(message) {
    super(message);
  }
}

export { InsufficientFundsError };
