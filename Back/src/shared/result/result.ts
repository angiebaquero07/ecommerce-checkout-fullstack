/**
 * Railway Oriented Programming - Result Type
 * Represents either a Success or Failure
 */

export type Result<T, E = Error> = Success<T> | Failure<E>;

export class Success<T> {
  readonly isSuccess = true;
  readonly isFailure = false;

  constructor(public readonly value: T) {}

  static of<T>(value: T): Success<T> {
    return new Success(value);
  }
}

export class Failure<E> {
  readonly isSuccess = false;
  readonly isFailure = true;

  constructor(public readonly error: E) {}

  static of<E>(error: E): Failure<E> {
    return new Failure(error);
  }
}

export const ok = <T>(value: T): Success<T> => new Success(value);
export const fail = <E>(error: E): Failure<E> => new Failure(error);

export function isOk<T, E>(result: Result<T, E>): result is Success<T> {
  return result.isSuccess;
}

export function isFail<T, E>(result: Result<T, E>): result is Failure<E> {
  return result.isFailure;
}

/**
 * Chain multiple Result-returning operations (pipe/andThen)
 */
export async function andThen<T, U, E>(
  result: Result<T, E>,
  fn: (value: T) => Promise<Result<U, E>>,
): Promise<Result<U, E>> {
  if (isOk(result)) {
    return fn(result.value);
  }
  return result as unknown as Failure<E>;
}

export function map<T, U, E>(
  result: Result<T, E>,
  fn: (value: T) => U,
): Result<U, E> {
  if (isOk(result)) {
    return ok(fn(result.value));
  }
  return result as unknown as Failure<E>;
}
