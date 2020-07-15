/*
 * Copyright (c) 2016-2020 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Maybe } from './maybe.js';

describe('Maybe data structure – ', () => {
  const testObj = { a: 1, b: 2, c: 3 };
  const testDeepObj = { a: 1, b: { x: 10, y: 20, z: { q: 100, r: 200 } }, c: 3 };
  const maybeWithVal = Maybe.of(42);
  const arrayMaybe = Maybe.of(['random', 'value']);
  const stringMaybe = Maybe.of('ohai');
  const objMaybe = Maybe.of({ ...testObj });
  const deepObjMaybe = Maybe.of({ ...testDeepObj });

  const nullMaybe = Maybe.of(null);
  const falseMaybe = Maybe.of(false);
  const emptyStringMaybe = Maybe.of('');
  const emptyObjMaybe = Maybe.of({});
  const emptyArrayMaybe = Maybe.of([]);
  const maybeWithoutVal = Maybe.of(void 0);

  describe('constructor', () => {
    it('should hold a value if passed one', () => {
      const something1 = new Maybe(42);
      const something2 = new Maybe('');
      const nothing1 = new Maybe(void 0);
      const nothing2 = new Maybe(null);

      expect(!something1.isNothing && something1.isJust).toBe(true, 'maybe with value has value');
      expect(!something2.isNothing && something2.isJust).toBe(true, 'maybe with empty string has value');
      expect(nothing1.isNothing && !nothing1.isJust).toBe(true, 'undefined maybe is nothing');
      expect(nothing2.isNothing && !nothing2.isJust).toBe(true, 'null maybe is nothing');

      expect(something1.unsafeValue).toBe(42, 'maybe with value returns value as expected');
      expect(something2.unsafeValue).toBe('', 'maybe with empty string returns value as expected');
      expect(nothing1.unsafeValue).toBe(null, 'undefined maybe returns null value');
      expect(nothing2.unsafeValue).toBe(null, 'null maybe returns null value');
    });
  });

  describe('of(): ', () => {
    it('should hold a value if passed one', () => {
      expect(!maybeWithVal.isNothing && maybeWithVal.isJust).toBe(true, 'maybe with value is just');
      expect(maybeWithoutVal.isNothing && !maybeWithoutVal.isJust).toBe(true, 'maybe w/o value is nothing');

      expect(maybeWithVal.unsafeValue).toBe(42, 'maybe.of wraps value as expected');
      expect(maybeWithoutVal.unsafeValue).toBe(null, 'maybe.of nothing returns null value');
    });

    it('should be a "nothing" type if given no value, undefined, or null', () => {
      expect(maybeWithoutVal.isNothing && !maybeWithoutVal.isJust).toBe(true, 'undefined nothing isNothing');
      expect(nullMaybe.isNothing && !nullMaybe.isJust).toBe(true, 'null nothing isNothing');
      expect(!falseMaybe.isNothing && falseMaybe.isJust).toBe(true, 'false maybe is NOT nothing');

      expect(maybeWithoutVal.unsafeValue).toBe(null, 'undefined nothing returns null value');
      expect(nullMaybe.unsafeValue).toBe(null, 'null nothing returns null value');
      expect(falseMaybe.unsafeValue).toBe(false, 'false maybe returns false');
    });
  });

  describe('isJust: ', () => {
    it('should identify as "just" if holds a value', () => {
      expect(falseMaybe.isJust).toBe(true, 'false value is still just');
      expect(emptyStringMaybe.isJust).toBe(true, 'empty string value is still just');
      expect(emptyObjMaybe.isJust).toBe(true, 'empty object value is still just');
      expect(emptyArrayMaybe.isJust).toBe(true, 'empty object value is still just');
      expect(arrayMaybe.isJust).toBe(true, 'value is just');
      expect(stringMaybe.isJust).toBe(true, 'string value is just');
      expect(objMaybe.isJust).toBe(true, 'object value is just');

      expect(nullMaybe.isJust).toBe(false, 'null value is not just');
      expect(maybeWithoutVal.isJust).toBe(false, 'undefined value is not just');
    });
  });

  describe('isNothing: ', () => {
    it('should identify as "nothing" if it holds no value', () => {
      expect(falseMaybe.isNothing).toBe(false, 'false value is something');
      expect(emptyStringMaybe.isNothing).toBe(false, 'empty string value is something');
      expect(emptyObjMaybe.isNothing).toBe(false, 'empty object value is something');
      expect(emptyArrayMaybe.isNothing).toBe(false, 'empty object value is something');
      expect(arrayMaybe.isNothing).toBe(false, 'value is something');
      expect(stringMaybe.isNothing).toBe(false, 'string value is something');
      expect(objMaybe.isNothing).toBe(false, 'object value is something');

      expect(nullMaybe.isNothing).toBe(true, 'null value is nothing');
      expect(maybeWithoutVal.isNothing).toBe(true, 'undefined value is nothing');
    });
  });

  describe('equals(): ', () => {
    it('should correctly assess equality of wrapped values', () => {
      const testObjMaybe = new Maybe({ ...testObj });
      const testNotObjMaybe = new Maybe({ a: 5, b: 10, c: 15 });
      const testDeepMaybe = new Maybe({ ...testDeepObj });
      const testFalseMaybe = new Maybe(false);
      const testEmptyStrMaybe = new Maybe('');
      const testMaybe = new Maybe(42);
      const testNullMaybe = new Maybe(null);
      const testNothing = new Maybe(void 0);

      expect(maybeWithVal.equals(testMaybe)).toBe(true, 'maybes with same value equate');

      // deep tests are not working!
      expect(objMaybe.equals(testObjMaybe)).toBe(true, 'object maybes with same value equate');
      expect(deepObjMaybe.equals(testDeepMaybe)).toBe(true, 'object maybes with same value equate deeply');

      expect(falseMaybe.equals(testFalseMaybe)).toBe(true, 'false maybes equate');
      expect(emptyStringMaybe.equals(testEmptyStrMaybe)).toBe(true, 'empty string maybes equate');

      expect(objMaybe.equals(testNotObjMaybe)).toBe(false, 'object maybes with different values do not equate');
      expect(testNothing.equals(maybeWithVal)).toBe(false, 'nothings and somethings do not equate');

      expect(maybeWithoutVal.equals(testNothing)).toBe(true, 'nothings from undefined nil types equate');
      expect(testNullMaybe.equals(nullMaybe)).toBe(true, 'nothings from null equate');
      expect(maybeWithoutVal.equals(testNullMaybe)).toBe(true, 'nothings equate even if from different nil types');

      expect(maybeWithoutVal.equals()).toBe(true, 'falls through as a nothing check');
      expect(maybeWithVal.equals()).toBe(false, 'falls through as a nothing check');
    });
  });

  function testMap(val: any): number {
    return val ? 42 : 0;
  }

  function mapFail(): null {
    return null;
  }

  describe('map(): ', () => {
    it('should map Maybe data structure and return new Maybe', () => {
      const testSomething = objMaybe.map(testMap);
      const testFalseyness = falseMaybe.map(testMap);
      const testNothing = maybeWithoutVal.map(testMap);

      expect(testSomething instanceof Maybe && testFalseyness instanceof Maybe && testNothing instanceof Maybe).toBe(
        true,
        'map returns Map type'
      );
      expect(testSomething.isJust && testSomething.unsafeValue).toBe(42, 'map returns wrapped values');
      expect(testFalseyness.isJust && testFalseyness.unsafeValue).toBe(0, 'even false map returns wrapped values');
      expect(testNothing.isNothing).toBe(true, 'mapping nothing returns a nothing');
    });

    it('should fallback to a nothing if the map short circuits the value', () => {
      const testme = objMaybe.map(mapFail);
      expect(testme.isNothing).toBe(true, 'should return a nothing if map messes up');
    });
  });

  describe('mapOr(): ', () => {
    it('should map Maybe data structure and return new Maybe', () => {
      const testSomething = maybeWithVal.mapOr(testMap, 999);
      const testFalseyness = falseMaybe.mapOr(testMap, 999);
      const testNothing = maybeWithoutVal.mapOr(testMap, 999);

      expect(testSomething instanceof Maybe && testFalseyness instanceof Maybe && testNothing instanceof Maybe).toBe(
        true,
        'map returns Map type'
      );
      expect(testSomething.isJust && testSomething.unsafeValue).toBe(42, 'mapOr returns wrapped values');
      expect(testFalseyness.isJust && testFalseyness.unsafeValue).toBe(0, 'even false mapOr returns wrapped values');
      expect(testFalseyness.isJust && testNothing.unsafeValue).toBe(
        999,
        'mapOr on nothing returns a wrapped default value'
      );
    });

    it('should fallback to a nothing if the map short circuits the value', () => {
      const testme = objMaybe.mapOr(mapFail, 999);
      expect(testme.unsafeValue).not.toBe(999, 'a map failure does not fallback to the default value (yet?)');
      expect(testme.isNothing).toBe(true, 'should return a nothing if map messes up');
    });
  });

  describe('mapOrElse(): ', () => {
    function ohai() {
      return 1994;
    }

    it('should map Maybe data structure and return a new Maybe', () => {
      const testSomething = maybeWithVal.mapOrElse(testMap, ohai);
      const testFalseyness = falseMaybe.mapOrElse(testMap, ohai);
      const testNothing = maybeWithoutVal.mapOrElse(testMap, ohai);

      expect(testSomething instanceof Maybe && testFalseyness instanceof Maybe && testNothing instanceof Maybe).toBe(
        true,
        'map returns Map type'
      );
      expect(testSomething.isJust && testSomething.unsafeValue).toBe(42, 'mapOrElse returns wrapped values');
      expect(testFalseyness.isJust && testFalseyness.unsafeValue).toBe(
        0,
        'even false mapOrElse returns wrapped values'
      );
      expect(testFalseyness.isJust && testNothing.unsafeValue).toBe(
        1994,
        'mapOrElse on nothing returns a wrapped value from the else function'
      );
    });

    it('should fallback to a nothing if the map short circuits the value', () => {
      const testme = objMaybe.mapOrElse(mapFail, ohai);
      expect(testme.unsafeValue).not.toBe(1994, 'a map failure does not fallback to the default function (yet?)');
      expect(testme.isNothing).toBe(true, 'should return a nothing if map messes up');
    });
  });

  describe('value: ', () => {
    it('should return value as a wrapped Maybe', () => {
      expect(
        maybeWithVal.value instanceof Maybe &&
          maybeWithoutVal.value instanceof Maybe &&
          falseMaybe.value instanceof Maybe &&
          nullMaybe.value instanceof Maybe
      ).toBe(true, 'value should return a wrapped value');
      expect(maybeWithVal.value.unsafeValue).toBe(42, 'wrapped value returned by value should be value');
      expect(maybeWithoutVal.value.isNothing).toBe(true, 'nothing returned by value should be wrapped');
      expect(falseMaybe.value.unsafeValue).toBe(false, 'false value should return wrapped');
    });
  });

  describe('valueOr: ', () => {
    it('should return value as a wrapped Maybe', () => {
      const defaultVal = 'ohai';
      const withVal = maybeWithVal.valueOr(defaultVal);
      const withoutVal = maybeWithoutVal.valueOr(defaultVal);
      const falseVal = falseMaybe.valueOr(defaultVal);

      expect(withVal instanceof Maybe && withoutVal instanceof Maybe && falseVal instanceof Maybe).toBe(
        true,
        'valueOr should return wrapped values'
      );
      expect(withVal.unsafeValue).toBe(42, 'valueOr should return value as expected');
      expect(withoutVal.unsafeValue).toBe(defaultVal, 'valueOr should return wrapped default value if used on nothing');
      expect(falseVal.unsafeValue).toBe(false, 'valueOr should consider a false boolean to be a value');
    });
  });

  describe('valueOrElse: ', () => {
    it('should return value as a wrapped Maybe', () => {
      function defaultFn() {
        return defaultObj;
      }
      const defaultObj = { yourAnswer: 'nope' };
      const withVal = maybeWithVal.valueOrElse(defaultFn);
      const withoutVal = maybeWithoutVal.valueOrElse(defaultFn);
      const falseVal = falseMaybe.valueOrElse(defaultFn);

      expect(withVal instanceof Maybe && withoutVal instanceof Maybe && falseVal instanceof Maybe).toBe(
        true,
        'valueOrElse should return wrapped values'
      );
      expect(withVal.unsafeValue).toBe(42, 'valueOrElse should return value as expected');
      expect(withoutVal.unsafeValue.yourAnswer).toBe(
        'nope',
        'valueOrElse should return wrapped default value if used on nothing'
      );
      expect(falseVal.unsafeValue).toBe(false, 'valueOrElse should consider a false boolean to be a value');
    });
  });

  describe('andThen: ', () => {
    it('should execute functions in chain and return a Maybe', () => {
      const testMe = emptyStringMaybe.andThen((val: string) => {
        return val + 'ohai';
      });
      expect(testMe instanceof Maybe).toBe(true, 'andThen should return wrapped values');
      expect(testMe.isJust && testMe.unsafeValue).toBe('ohai', 'andThen should return wrapped value from then Fn');
    });

    it('should chain more than one level deep', () => {
      const testMe = emptyStringMaybe
        .andThen((val: string) => {
          return val + 'o';
        })
        .andThen((val: string) => {
          return val + 'h';
        })
        .andThen((val: string) => {
          return val + 'a';
        })
        .andThen((val: string) => {
          return val + 'i';
        });

      expect(testMe.isJust && testMe.unsafeValue).toBe('ohai', 'andThen should return wrapped value from then Fn');
    });

    it('should not die when given a "nothing"', () => {
      const testMe = maybeWithoutVal
        .andThen((val: string) => {
          return val + 'o';
        })
        .andThen((val: string) => {
          return val + 'h';
        })
        .andThen((val: string) => {
          return val + 'a';
        })
        .andThen((val: string) => {
          return val + 'i';
        });

      expect(testMe.isNothing).toBe(true, 'andThen should return nothing if given a nothing');
    });

    it('should not die when encountering a "nothing" in the chain', () => {
      const testMe = maybeWithoutVal
        .andThen((val: string) => {
          return val + 'o';
        })
        .andThen((val: string) => {
          return val + 'h';
        })
        .andThen(() => {
          return null;
        })
        .andThen((val: string) => {
          return val + 'i';
        });

      expect(testMe.isNothing).toBe(true, 'andThen should return nothing if hitting a nil value in the chain');
    });
  });
});
