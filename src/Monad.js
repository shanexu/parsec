import { curry, flatMap, flip } from 'lodash/fp'
import { _instance_method, _instance, _extend } from './utils.js'
import { pure } from './Applicative.js'

let binding = curry((ma, f) => _instance_method(Monad, '>>=', ma)(ma, f))
let defaultFail = s => { throw new Error(s) }
let defaultSequentiallyCompose = (m, k) => binding(m, () => k)

let Monad = {
  // Sequentially compose two actions, passing any value produced
  // by the first as an argument to the second.
  // m a -> (a -> m b) -> m b
  '>>=': binding
  ,binding

  // Sequentially compose two actions, discarding any value produced
  // by the first, like sequencing operators (such as the semicolon)
  // in imperative languages.
  // m a -> m b -> m b
  ,'>>': curry((m, k) => _instance_method(Monad, '>>', m, defaultSequentiallyCompose)(m, k))

  // Inject a value into the monadic type.
  // a -> m a
  ,return: curry((m, a) => _instance_method(Monad, 'return', m, pure)(m, a))

  // | Fail with a message.  This operation is not part of the
  // mathematical definition of a monad, but is invoked on pattern-match
  // failure in a @do@ expression.
  //
  // As part of the MonadFail proposal (MFP), this function is moved
  // to its own class 'MonadFail' (see "Control.Monad.Fail" for more
  //                              -- details). The definition here will be removed in a future
  // release.
  // String -> m a
  ,fail: curry((type, s) => _instance_method(Monad, 'fail', type, defaultFail)(s))

  // Same as '>>=', but with the arguments interchanged.
  // (a -> m b) -> m a -> m b
  ,'=<<': flip(binding)

  ,_methods: {
    '>>=': function(f) {
      return Monad['>>='](this, f)
    }
    ,'>>': function(k) {
      return Monad['>>'](this, k)
    }
    ,binding: function(f) {
      return Monad['>>='](this, f)
    }
  }
  ,_static_methods: {
    return: function(a) {
      return Monad['return'](this, a)
    }
    ,fail: function(s) {
      return Monad['fail'](this, s)
    }
    ,'=<<': function(a,m) {
      return Monad['=<<'](a,m)
    }
  }
}

_instance(Monad, Array).where({
  '>>=': (xs, f) => flatMap(f, xs)
})

_extend(Array.prototype, Monad._methods)
_extend(Array, Monad._static_methods)

module.exports = Monad
