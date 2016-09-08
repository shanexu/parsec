import { _instance_method, _instance } from './utils.js'
import { curry, concat } from 'lodash/fp'

let empty = type => _instance_method(Alternative, 'empty', type)
let f1 = curry((a, b) => _instance_method(Alternative, '<|>', a)(a,b))
let Alternative = {
  // The identity of '<|>'
  empty

  // An associative binary operation
  // f a -> f a -> f a
  ,'<|>': f1
  ,_methods: {
    '<|>': function(other) {
      return Alternative['<|>'](this, other)
    }
  }
  ,_static_methods: {
    empty: function() {
      return Alternative['empty'](this)
    }
  }
}

_instance(Alternative, Array).where({
  empty: [],
  '<|>': concat
})

Array.prototype['<|>'] = function(other) {
  return Alternative['<|>'](this, other)
}

module.exports = Alternative
