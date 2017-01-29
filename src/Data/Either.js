import {
  identity,
  curry,
  filter
} from 'lodash/fp'
import {
  _instance,
  _case,
  _extend
} from 'utils'
import Functor, {
  fmap
} from 'Data/Functor'
import Applicative from 'Control/Applicative'
import Monad from 'Control/Monad'

let payload = {}

export class Either {
  constructor(value, x) {
    if (x !== payload) {
      throw new TypeError('Either is an abstract class')
    }
    this.value = value
  }
  either(f, g) {
    return either(f, g, this)
  }
}

_extend(Either.prototype, Functor._methods, Applicative._methods, Monad._methods)
_extend(Either, Functor._static_methods, Applicative._static_methods, Monad._static_methods)

export class Right extends Either {
  constructor(value) {
    super(value, payload)
  }
}

export function right(value) {
  return new Right(value)
}

export class Left extends Either {
  constructor(value) {
    super(value, payload)
  }
}

export function left(value) {
  return new Left(value)
}

// | Case analysis for the 'Either' type.
// If the value is @'Left' a@, apply the first function to @a@;
// if it is @'Right' b@, apply the second function to @b@.
//
// ==== __Examples__
//
// We create two values of type @'Either' 'String' 'Int'@, one using the
// 'Left' constructor and another using the 'Right' constructor. Then
// we apply \"either\" the 'length' function (if we have a 'String')
// or the \"times-two\" function (if we have an 'Int'):
//
// >>> let s = Left "foo" :: Either String Int
// >>> let n = Right 3 :: Either String Int
// >>> either length (*2) s
// 3
// >>> either length (*2) n
// 6
//
// either                  :: (a -> c) -> (b -> c) -> Either a b -> c
export let either = curry((f, g, e) => _case(e)
  .of([
    [Left, ({
      value: x
    }) => f(x)],
    [Right, ({
      value: y
    }) => g(y)]
  ]))

export let isLeft = e => _case(e)
  .of([
    [Left, () => true],
    [Right, () => false]
  ])

export let isRight = e => _case(e)
  .of([
    [Left, () => false],
    [Right, () => true]
  ])

// | Partitions a list of 'Either' into two lists.
// All the 'Left' elements are extracted, in order, to the first
// component of the output.  Similarly the 'Right' elements are extracted
// to the second component of the output.
//
// ==== __Examples__
//
// Basic usage:
//
// >>> let list = [ Left "foo", Right 3, Left "bar", Right 7, Left "baz" ]
// >>> partitionEithers list
// (["foo","bar","baz"],[3,7])
//
// The pair returned by @'partitionEithers' x@ should be the same
// pair as @('lefts' x, 'rights' x)@:
//
// >>> let list = [ Left "foo", Right 3, Left "bar", Right 7, Left "baz" ]
// >>> partitionEithers list == (lefts list, rights list)
// True
//
// partitionEithers :: [Either a b] -> ([a],[b])
export let partitionEithers = es => [lefts(es), rights(es)]

// | Extracts from a list of 'Either' all the 'Left' elements.
// All the 'Left' elements are extracted in order.
//
// ==== __Examples__
//
// Basic usage:
//
// >>> let list = [ Left "foo", Right 3, Left "bar", Right 7, Left "baz" ]
// >>> lefts list
// ["foo","bar","baz"]
//
// lefts   :: [Either a b] -> [a]
export let lefts = filter(isLeft)

// | Extracts from a list of 'Either' all the 'Right' elements.
// All the 'Right' elements are extracted in order.
//
// ==== __Examples__
//
// Basic usage:
//
// >>> let list = [ Left "foo", Right 3, Left "bar", Right 7, Left "baz" ]
// >>> rights list
// [3,7]
//
// rights   :: [Either a b] -> [b]
export let rights = filter(isRight)

_instance(Functor, Either)
  .where({
    fmap: (func, e) => _case(e)
      .of([
        [Left, identity],
        [Right, ({
          value
        }) => right(func(value))]
      ])
  })

_instance(Applicative, Either)
  .where({
    pure: right,
    '<*>': (mf, m) => _case(mf)
      .of([
        [Left, identity],
        [Right, ({
          value: f
        }) => fmap(f, m)]
      ])
  })

_instance(Monad, Either)
  .where({
    '>>=': (m, k) => _case(m)
      .of([
        [Left, identity],
        [Right, ({
          value: r
        }) => k(r)]
      ])
  })
