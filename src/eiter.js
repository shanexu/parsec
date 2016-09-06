import { identity, curry } from 'lodash/fp'
import { _instance, _case } from './utils.js'
import Functor, { fmap } from './functor.js'
import Applicative from './applicative.js'
import Monad from './monad.js'

let payload = {}

export class Either{
  constructor(value, x) {
    if(x !== payload) {
      throw new TypeError('Either is an abstract class')
    }
    this.value = value
  }
  either(f, g) {
    return either(f, g, this)
  }
}

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

export let either = curry((f, g, e) => _case(e).of([
  [Left,   ({value:x}) => f(x)]
  ,[Right, ({value:y}) => g(y)]
]))

_instance(Functor, Either).where({
  fmap: (func, e) => _case(e).of([
    [Left,   identity]
    ,[Right, ({value}) => right(func(value))]
  ])
})

_instance(Applicative, Either).where({
  pure: right
  ,'<*>': (mf, m) => _case(mf).of([
    [Left,   identity]
    ,[Right, ({value:f}) => fmap(f, m)]
  ])
})

_instance(Monad, Either).where({
  '>>=': (m, k) => _case(m).of([
    [Left,   identity]
    ,[Right, ({value:r}) => k(r)]
  ])
})
