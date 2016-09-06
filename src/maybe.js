import { _instance, _extend } from './utils.js'
import Functor, { fmap } from './functor.js'
import Applicative from './applicative.js'
import Monad from './monad.js'
import Alternative from './alternative.js'
import { _case } from './utils.js'

const payload = {}

export class Maybe{
  constructor(x) {
    if(x !== payload) {
      throw new TypeError('Maybe is an abstract class')
    }
  }
}

_extend(Maybe.prototype, Functor._methods, Applicative._methods, Monad._methods, Alternative._methods)

export class Just extends Maybe {
  constructor(value) {
    super(payload)
    this.value = value
  }
}

export function just(value) {
  return new Just(value)
}

export let Nothing = (() => {
  class Nothing extends Maybe {
    constructor() {
      super(payload)
    }
  }
  return new Nothing()
})()

_instance(Functor, Maybe).where({
  fmap: (func, m) => _case(m).of([
    [Nothing, () => Nothing]
    ,[Just,   ({value}) => just(func(value))]
  ])
})

_instance(Applicative, Maybe).where({
  pure: just,
  '<*>': (mf, m) => _case(mf).of([
    [Nothing, () => Nothing]
    ,[Just,   ({value: f}) => fmap(f, m)]
  ])
})

_instance(Monad, Maybe).where({
  '>>=': (m, k) => _case(m).of([
    [Nothing, () => Nothing]
    ,[Just,   ({value: x}) => k(x)]
  ])
  ,'fail': () => Nothing
})

_instance(Alternative, Maybe).where({
  empty: Nothing,
  '<|>': (l, r) => _case(l).of([
    [Nothing, () => r]
    ,[Just,   () => l]
  ])
})
