import { identity, curry, flip, flatMap } from 'lodash/fp'
import { _instance_method, _instance, _extend } from './utils.js'
import Functor from 'Data/Functor.js'

let pure = curry((f, a) => _instance_method(Applicative, 'pure', f)(a))
let f1 = curry((fab, fa) => _instance_method(Applicative, '<*>', fab)(fab, fa))
let liftA = curry((ab, fa) => f1(pure(fa)(ab), fa))
let liftA2 = curry((f, a, b) => f1(Functor.fmap(x => y => f(x, y), a), b))

let Applicative = {
  // Lift a value.
  // a -> f a
  pure

  //Sequential application.
  // f (a -> b) -> f a  -> f b
  ,'<*>': f1

  // f a -> f (a -> b) -> f b
  ,'<**>': flip(f1)

  //Sequence actions, discarding the value of the first argument.
  // f a -> f b -> f b
  ,'*>': curry((fa, fb) => f1(Functor['<$'](identity, fa), fb))

  //Sequence actions, discarding the value of the second argument.
  // f a -> f b -> f a
  ,'<*': liftA2(identity)

  // (a -> b) -> f a -> f b
  ,liftA

  // (a -> b -> c ) -> f a -> f b -> f c
  ,liftA2
  ,_methods: {
    '<*>': function(m) {
      return Applicative['<*>'](this, m)
    }
    ,'<**>': function(m) {
      return Applicative['<**>'](this, m)
    }
    ,'*>': function(m) {
      return Applicative['*>'](this, m)
    }
    ,'<*': function(m) {
      return Applicative['<*'](this, m)
    }
  }
  ,_static_methods: {
    pure: function(a) {
      return Applicative['pure'](this)(a)
    }
    ,liftA: function(ab, fa) {
      return Applicative['liftA'](ab, fa)
    }
    ,liftA2: function(abc, fa, fb) {
      return Applicative['liftA2'](abc, fa, fb)
    }
  }
}

_instance(Applicative, Array).where({
  pure: a => [a],
  '<*>': (funs, arr) => flatMap(f => Functor.fmap(f, arr), funs)
})

_extend(Array.prototype, Applicative._methods)
_extend(Array, Applicative._static_methods)

module.exports = Applicative
