import {
  _instance_method,
  _instance,
  _extend
} from './utils.js'

let show = a => _instance_method(Show, 'show', a)(a)

let Show = {
  'show': show,
  _methods: {
    'show': function() {
      return Show['show'](this)
    }
  }
}

module.exports = Show

_instance(Show, String)
  .where({
    'show': s => JSON.stringify(s)
  })

_extend(String.prototype, Show._methods)

_instance(Show, Array)
  .where({
    'show': a => JSON.stringify(a)
  })

_extend(Array.prototype, Show._methods)

_instance(Show, Number)
  .where({
    'show': n => JSON.stringify(n)
  })

_extend(Number.prototype, Show._methods)
