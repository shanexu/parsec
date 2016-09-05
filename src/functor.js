import { _instance_method, _instance } from './utils.js'
import _fp, { constant, curry } from 'lodash/fp'

let Functor = {
  fmap: curry((ab, fa) => _instance_method(Functor, 'fmap', fa)(ab, fa)),
  '<$': curry((a, fb) => Functor.fmap(constant(a), fb))
}

Function.prototype.fmap = function(f){
  return Functor.fmap(this, f)
}

_instance(Functor, Array).where({
  fmap: (func, f) => _fp.map(func, f)
})

module.exports = Functor
