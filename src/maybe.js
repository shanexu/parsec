import { _instance } from './utils.js'
import Functor, { fmap } from './functor.js'
import Applicative from './applicative.js'
import { _case } from './utils.js'

export class Maybe{
  map(func) {
    return fmap(func, this)
  }
  '<*>'(m) {
    return Applicative['<*>'](this, m)
  }
  '<**>'(m) {
    return Applicative['<**>'](this, m)
  }
  '*>'(m) {
    return Applicative['*>'](this, m)
  }
  '<*'(m) {
    return Applicative['<*'](this, m)
  }
}

export class Just extends Maybe {
  constructor(value) {
    super()
    this.value = value
  }
}

export function just(value) {
  return new Just(value)
}

export let Nothing = new Maybe()

_instance(Functor, Maybe).where({
  fmap: (func, m) => _case(m).of([
    [Nothing, () => Nothing],
    [Just,    ({value}) => just(func(value))]
  ])
})

_instance(Applicative, Maybe).where({
  pure: just,
  '<*>': (mf, m) => _case(mf).of([
    [Nothing, () => Nothing],
    [Just,    ({value: f}) => fmap(f, m)]
  ])
})
