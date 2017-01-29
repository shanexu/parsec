import { curry, reduce } from 'lodash/fp'
import { _instance_method, _instance, _extend } from 'utils'

let mempty = m => _instance_method(Monid, 'mempty', m)
let mappend = curry((a1, a2) => _instance_method(Monid, 'mappend', a1)(a1, a2))

let Monid = {
  // mempty  :: a
  mempty

  // mappend :: a -> a -> a
  ,mappend

  // mconcat :: [a] -> a
  , mconcat: curry((m, arr) => reduce(mappend, mempty(m), arr))

  ,_name: 'Monid'

  ,_methods: {
    mappend: function(other) {
      return Monid['mappend'](this, other)
    }
  }
  ,_static_methods: {
    mempty: function() {
      return Monid['mempty'](this)
    }
    ,mconcat: function(a) {
      return Monid['mconcat'](this)(a)
    }
  }
}

_instance(Monid, Array).where({
  mempty: []
  ,mappend: (a1, a2) => [...a1, ...a2]
})
_extend(Array.prototype, Monid._methods)
_extend(Array, Monid._static_methods)

module.exports = Monid
