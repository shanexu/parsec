import { curry, flatMap } from 'lodash/fp'
import { _instance_method, _instance } from './utils.js'
import { flip } from 'lodash/fp'
import { pure } from './applicative.js'

let bind = curry((ma, f) => _instance_method(Monad, '>>=', ma)(ma, f))
let defaultFail = s => { throw new Error(s) }
let defaultSequentiallyCompose = (m, k) => bind(m, () => k)

let Monad = {
  // Sequentially compose two actions, passing any value produced
  // by the first as an argument to the second.
  // m a -> (a -> m b) -> m b
  '>>=': bind

  // Sequentially compose two actions, discarding any value produced
  // by the first, like sequencing operators (such as the semicolon)
  // in imperative languages.
  // m a -> m b -> m b
  ,'>>': curry((m, k) => _instance_method(Monad, '>>', m, defaultSequentiallyCompose)(m, k))

  // Inject a value into the monadic type.
  // a -> m a
  ,return: pure

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
  ,'=<<': flip(bind)

  ,_methods: {
    '>>=': function(f) {
      return Monad['>>='](this, f)
    }
    ,'>>': function(k) {
      return Monad['>>'](this, k)
    }
    ,bind: function(f) {
      return Monad['>>='](this, f)
    }
  }
}

_instance(Monad, Array).where({
  '>>=': (xs, f) => flatMap(f, xs)
})

Array.prototype['>>='] = function(f){
  return Monad['>>='](this, f)
}

Array.prototype['>>'] = function(k) {
  return Monad['>>'](this, k)
}

Function.prototype['=<<'] = function(m) {
  return Monad['=<<'](this, m)
}

module.exports = Monad
