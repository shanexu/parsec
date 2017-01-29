import { compose } from 'lodash/fp'
import { _extend, _instance } from './utils.js'
import Functor from 'Data/Functor.js'
import Applicative from './Applicative.js'
import Monad from './Monad.js'


export class Identity {
  constructor(i) {
    this.runIdentity = i
  }
}

export let Identity_ = i => new Identity(i)

export let runIdentity = id => id.runIdentity

_instance(Functor, Identity).where({
  fmap: (f, i) => compose(Identity_, f, runIdentity)(i)
})

_instance(Applicative, Identity).where({
  pure: i => Identity_(i),
  '<*>': (f, i) => compose(Identity_, runIdentity(f), runIdentity)(i)
})

_instance(Monad, Identity).where({
  return: i => Identity_(i),
  '>>=': (m, k) => compose(k, runIdentity)(m)
})

_extend(Identity.prototype, Functor._methods, Applicative._methods, Monad._methods)
_extend(Identity, Functor._static_methods, Applicative._static_methods, Monad._static_methods)
