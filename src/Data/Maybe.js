import {
  _instance,
  _extend,
  _case
} from 'utils'
import Functor, {
  fmap
} from 'Data/Functor'
import Applicative from 'Applicative'
import Monad from 'Monad'
import Alternative from 'Alternative'

const payload = {}

export class Maybe {
  constructor(x) {
    if (x !== payload) {
      throw new TypeError('Maybe is an abstract class')
    }
  }
}

_extend(Maybe.prototype, Functor._methods, Applicative._methods, Monad._methods,
  Alternative._methods)
_extend(Maybe, Functor._static_methods, Applicative._static_methods, Monad._static_methods,
  Alternative._static_methods)

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

_instance(Functor, Maybe)
  .where({
    fmap: (func, m) => _case(m)
      .of([
        [Nothing, () => Nothing],
        [Just, ({
          value
        }) => just(func(value))]
      ])
  })

_instance(Applicative, Maybe)
  .where({
    pure: just,
    '<*>': (mf, m) => _case(mf)
      .of([
        [Nothing, () => Nothing],
        [Just, ({
          value: f
        }) => fmap(f, m)]
      ])
  })

_instance(Monad, Maybe)
  .where({
    '>>=': (m, k) => _case(m)
      .of([
        [Nothing, () => Nothing],
        [Just, ({
          value: x
        }) => k(x)]
      ]),
    'fail': () => Nothing
  })

_instance(Alternative, Maybe)
  .where({
    empty: Nothing,
    '<|>': (l, r) => _case(l)
      .of([
        [Nothing, () => r],
        [Just, () => l]
      ])
  })
