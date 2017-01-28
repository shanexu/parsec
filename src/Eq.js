import {
  _instance_method,
  _instance,
  _extend
} from './utils.js'
import {
  curry,
  isEqual
} from 'lodash/fp'

let equal = curry((a1, a2) => _instance_method(Eq, '==', a1)(a1, a2))
let notEqual = curry((a1, a2) => !equal(a1, a2))
let Eq = {
  '==': equal,
  '/=': notEqual,
  _methods: {
    '==': function(other) {
      return Eq['=='](this, other)
    },
    '/=': function(other) {
      return Eq['/='](this, other)
    }
  }

}

module.exports = Eq

_instance(Eq, Array)
  .where({
    '==': isEqual
  })

_extend(Array.prototype, Eq._methods)

_instance(Eq, Number)
  .where({
    '==': (a, b) => a === b
  })

_extend(Number.prototype, Eq._methods)

_instance(Eq, String)
  .where({
    '==': (a, b) => a === b
  })

_extend(String.prototype, Eq._methods)
