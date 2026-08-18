/**
 * Domain Errors - shared error types across the application
 */

export enum DomainErrorCode {
  PRODUCT_NOT_FOUND = 'PRODUCT_NOT_FOUND',
  INSUFFICIENT_STOCK = 'INSUFFICIENT_STOCK',
  TRANSACTION_NOT_FOUND = 'TRANSACTION_NOT_FOUND',
  INVALID_TRANSACTION_STATUS = 'INVALID_TRANSACTION_STATUS',
  PAYMENT_GATEWAY_ERROR = 'PAYMENT_GATEWAY_ERROR',
  INVALID_INPUT = 'INVALID_INPUT',
  INTERNAL_ERROR = 'INTERNAL_ERROR',
}

export class DomainError extends Error {
  constructor(
    public readonly code: DomainErrorCode,
    public readonly message: string,
    public readonly statusCode: number = 400,
  ) {
    super(message);
    this.name = 'DomainError';
  }

  static productNotFound(id: string): DomainError {
    return new DomainError(
      DomainErrorCode.PRODUCT_NOT_FOUND,
      `Product with id ${id} not found`,
      404,
    );
  }

  static insufficientStock(productId: string): DomainError {
    return new DomainError(
      DomainErrorCode.INSUFFICIENT_STOCK,
      `Insufficient stock for product ${productId}`,
      422,
    );
  }

  static transactionNotFound(id: string): DomainError {
    return new DomainError(
      DomainErrorCode.TRANSACTION_NOT_FOUND,
      `Transaction with id ${id} not found`,
      404,
    );
  }

  static invalidTransactionStatus(status: string): DomainError {
    return new DomainError(
      DomainErrorCode.INVALID_TRANSACTION_STATUS,
      `Cannot process transaction with status ${status}`,
      422,
    );
  }

  static paymentGatewayError(message: string): DomainError {
    return new DomainError(
      DomainErrorCode.PAYMENT_GATEWAY_ERROR,
      `Payment gateway error: ${message}`,
      502,
    );
  }

  static invalidInput(message: string): DomainError {
    return new DomainError(
      DomainErrorCode.INVALID_INPUT,
      message,
      400,
    );
  }

  static internal(message: string): DomainError {
    return new DomainError(
      DomainErrorCode.INTERNAL_ERROR,
      message,
      500,
    );
  }
}
