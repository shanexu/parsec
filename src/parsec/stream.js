import { _instance, _extend, _case, _instance_method, otherwise } from '../utils.js'
import { curry, head, tail } from 'lodash/fp'
import M from '../monad.js'
import { just, Nothing } from '../maybe.js'

let Stream = {
  uncons: curry((m, str) => M.return(m)(_instance_method(Stream, 'uncons', str)(str)))
  ,_name: 'Stream'
  ,_methods: {
    uncons: function(m){
      return Stream['uncons'](m)(this)
    }
  }
}

_instance(Stream, Array).where({
  uncons: a => _case(a).of([
    [[],        () => Nothing],
    [otherwise, a => just([head(a), tail(a)])]
  ])
})
_extend(Array.prototype, Stream._methods)

_instance(Stream, String).where({
  uncons: a => _case(a).of([
    ['',        () => Nothing],
    [otherwise, (a) => just([a[0], a.slice(1)])]
  ])
})
_extend(String.prototype, Stream._methods)

module.exports = Stream
