import {
  _instance_method,
  _instance,
  _extend
} from 'utils'
import {
  constant,
  curry,
  map
} from 'lodash/fp'

let Functor = {
  fmap: curry((ab, fa) => _instance_method(Functor, 'fmap', fa)(ab, fa)),

  '<$': curry((a, fb) => Functor.fmap(constant(a), fb)),

  _methods: {
    map: function(func) {
      return Functor['fmap'](func, this)
    }
  },

  _static_methods: {
    fmap: function(ab, fa) {
      return Functor['fmap'](ab, fa)
    },
    '<$': function(a, fb) {
      return Functor['<$'](a, fb)
    }
  }
}

Function.prototype.fmap = function(f) {
  return Functor.fmap(this, f)
}

_instance(Functor, Array)
  .where({
    fmap: (func, f) => map(func, f)
  })

_extend(Array, Functor._static_methods)

module.exports = Functor
