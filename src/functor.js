import { _instance_method, _instance } from './utils.js'
import { constant, curry, map } from 'lodash/fp'

let Functor = {
  fmap: curry((ab, fa) => _instance_method(Functor, 'fmap', fa)(ab, fa))

  ,'<$': curry((a, fb) => Functor.fmap(constant(a), fb))


  ,_methods: {
    map: function(func) {
      return Functor['fmap'](func, this)
    }
  }
}

Function.prototype.fmap = function(f){
  return Functor.fmap(this, f)
}

_instance(Functor, Array).where({
  fmap: (func, f) => map(func, f)
})

module.exports = Functor
