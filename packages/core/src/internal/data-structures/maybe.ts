/*
 * Copyright (c) 2016-2020 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import isNil from 'ramda/es/isNil';
import equals from 'ramda/es/equals';

let nothing: Maybe<any>;

/**
 * A Maybe is a data structure that can exist in two states: having something and not having anything.
 *
 * The Maybe is a wrapper for values that might be of a type, like an object or an array or a string,
 * or might not exist at all. This wrapper serves as a safety valve so that you don't have to preemptively
 * write defensive code in your application to account for values being undefined or null.
 *
 * Creating a maybe...
 *
 * ```
 * import { Maybe } from '@clr/core/internal';
 *
 * // both of these lines create a Maybe
 * const aMaybe = new Maybe(someValue);
 * const anotherMaybe = Maybe.of(someValue)
 * ```
 *
 * You would want to use a Maybe when you may need a fallback value or operation. Or if you need to chain
 * operations even if they are passing null or undefined values.
 *
 * This is what separates a Maybe from nullish coalescing in Typescript.
 *
 * ```
 * Maybe.of(unknownVar).andThen(doSomething).valueOr('a default value').andThen(doSomethingMore).
 * andThen(doSomethingMoreAgain).valueOr('final default').unsafeValue;
 * ```
 *
 * ...would work with a Maybe but you could not do that with nullish coalescing.
 * In the end, Maybes are another tool. They have their strengths and address some use cases very well.
 *
 */
export class Maybe<T> {
  private _value: T | null;

  constructor(value: T | undefined | null) {
    this._value = isNil(value) ? null : value;
  }

  // static setters
  /*
   * A Maybe stores its value as an immutable. Its value cannot be changed once the Maybe is created.
   */
  static just<T>(value: T) {
    if (isNil(value)) {
      throw Error('Maybe.just must be given a non-null value (@clr/core)');
    }
    return new Maybe(value);
  }

  static nothing() {
    if (!nothing) {
      nothing = new Maybe(null);
    }
    return nothing;
  }

  /*
   * `of()` is a convenience for developers who would rather not use `new` to create Maybes.
   */
  static of<T>(value: T) {
    return isNil(value) ? Maybe.nothing() : Maybe.just(value);
  }

  // identity
  get isJust(): boolean {
    return this._value !== null;
  }

  get isNothing(): boolean {
    return this._value === null;
  }

  /*
   * `equals()` is tested for deep equality.
   */
  equals(comparedMaybe?: Maybe<T>): boolean {
    if (isNil(comparedMaybe)) {
      return this.isNothing;
    }

    if (comparedMaybe.isNothing && this.isNothing) {
      return true;
    }

    // we know both (maybe) have values; so they cannot both be nothing
    const comparedVal = comparedMaybe.isJust && comparedMaybe.unsafeValue;
    const myVal = this.isJust && this.unsafeValue;
    return equals(comparedVal, myVal);
  }

  // map methods - return wrapped Maybe values; the same way an Array.map returns a new array

  map<U>(mapFn: (val: T) => U): Maybe<U> {
    return isNil(this._value) ? Maybe.nothing() : Maybe.of(mapFn(this._value));
  }

  mapOr<U>(mapFn: (val: T) => U, defaultVal: U): Maybe<U> {
    return isNil(this._value) ? Maybe.just<U>(defaultVal) : Maybe.of(mapFn(this._value));
  }

  mapOrElse<U>(mapFn: (val: T) => U, elseFn: () => U): Maybe<U> {
    return isNil(this._value) ? Maybe.of<U>(elseFn()) : Maybe.of(mapFn(this._value));
  }

  // get methods access the value of the Maybe wrapper

  get value(): Maybe<T> {
    return new Maybe<T>(this._value);
  }

  /*
   * There is nothing terribly unsafe about `unsafeValue`.
   *
   * It is called `unsafeValue` to note that it may return null.
   */
  get unsafeValue(): T | null {
    return isNil(this._value) ? null : this._value;
  }

  valueOr(defaultVal: T): Maybe<T> {
    return new Maybe<T>(isNil(this._value) ? defaultVal : this._value);
  }

  valueOrElse(elseFn: () => T): Maybe<T> {
    return new Maybe<T>(isNil(this._value) ? elseFn() : this._value);
  }

  // chaining

  andThen<U>(nextFn: (val: T | null) => U): Maybe<U> {
    return this.isNothing ? Maybe.nothing() : Maybe.just<U>(nextFn(this._value));
  }
}
