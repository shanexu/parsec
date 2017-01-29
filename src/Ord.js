import { curry } from 'lodash/fp'
import { _instance_method, _instance, _extend } from 'utils'
import { LT, EQ, GT } from 'Ordering'

let compare = curry((a1, a2) => _instance_method(Ord, 'compare', a1)(a1, a2))
let lt = curry((a1, a2) => compare(a1, a2) === LT)
let gt = curry((a1, a2) => compare(a1, a2) === GT)
let lte = curry((a1, a2) => compare(a1, a2) !== GT)
let gte = curry((a1, a2) => compare(a1, a2) !== LT)
let min = curry((a1, a2) => lt(a1, a2) ? a1 : a2)
let max = curry((a1, a2) => gt(a1, a2) ? a1 : a2)
let Ord = {
  '<': lt
  ,'<=': lte
  ,'>': gt
  ,'>=': gte
  ,min
  ,max
  ,compare

  ,_name: 'Ord'
  ,_methods: {
    '<': function(other) {
      return Ord['<'](this, other)
    }
    ,'<=': function(other) {
      return Ord['<='](this, other)
    }
    ,'>': function(other) {
      return Ord['>'](this, other)
    }
    ,'>=': function(other) {
      return Ord['>='](this, other)
    }
    ,min: function(other) {
      return Ord['min'](this, other)
    }
    ,max: function(other) {
      return Ord['max'](this, other)
    }
    ,compare: function(other) {
      return Ord['compare'](this, other)
    }
  }
}

_instance(Ord, Number).where({
  compare: (a, b) => a < b ? LT : (a === b ? EQ : GT)
})

_extend(Number.prototype, Ord._methods)

_instance(Ord, String).where({
  compare: (a, b) => a < b ? LT : (a === b ? EQ : GT)
})

_extend(String.prototype, Ord._methods)


module.exports = Ord
