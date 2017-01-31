import {
  curry,
  reduce
} from 'lodash/fp'
import {
  _instance_method,
  _instance,
  _extend
} from 'utils'

let mempty = m => _instance_method(Monoid, 'mempty', m)
let mappend = curry((a1, a2) => _instance_method(Monoid, 'mappend', a1)(a1, a2))

let Monoid = {
  // mempty  :: a
  mempty,

  // mappend :: a -> a -> a
  mappend,

  // mconcat :: [a] -> a
  mconcat: curry((m, arr) => reduce(mappend, mempty(m), arr)),

  _name: 'Monoid',

  _methods: {
    mappend: function(other) {
      return Monoid['mappend'](this, other)
    }
  },
  _static_methods: {
    mempty: function() {
      return Monoid['mempty'](this)
    },
    mconcat: function(a) {
      return Monoid['mconcat'](this)(a)
    }
  }
}

_instance(Monoid, Array)
  .where({
    mempty: [],
    mappend: (a1, a2) => [...a1, ...a2]
  })
_extend(Array.prototype, Monoid._methods)
_extend(Array, Monoid._static_methods)

module.exports = Monoid
