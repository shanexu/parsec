import { curry } from 'lodash/fp'
import { _instance_method } from './utils.js'

// | Class 'Enum' defines operations on sequentially ordered types.
//
// The @enumFrom@... methods are used in Haskell's translation of
// arithmetic sequences.
//
// Instances of 'Enum' may be derived for any enumeration type (types
// whose constructors have no fields).  The nullary constructors are
// assumed to be numbered left-to-right by 'fromEnum' from @0@ through @n-1@.
// See Chapter 10 of the /Haskell Report/ for more details.
//
// For any type that is an instance of class 'Bounded' as well as 'Enum',
// the following should hold:
//
// * The calls @'succ' 'maxBound'@ and @'pred' 'minBound'@ should result in
//   a runtime error.
//
// * 'fromEnum' and 'toEnum' should give a runtime error if the
//   result value is not representable in the result type.
//   For example, @'toEnum' 7 :: 'Bool'@ is an error.
//
// * 'enumFrom' and 'enumFromThen' should be defined with an implicit bound,
//   thus:
//
// >    enumFrom     x   = enumFromTo     x maxBound
// >    enumFromThen x y = enumFromThenTo x y bound
// >      where
// >        bound | fromEnum y >= fromEnum x = maxBound
// >              | otherwise                = minBound
//
let toEnum = curry((type, i) => _instance_method(Enum, 'toEnum', type)(i))
let fromEnum = a => _instance_method(Enum, 'fromEnum', a)(a)
let defaultSucc = a => toEnum(a, fromEnum(a) + 1)
let defaultPred = a => toEnum(a, fromEnum(a) - 1)
let Enum = {
  // | the successor of a value.  For numeric types, 'succ' adds 1.
  // succ                :: a -> a
  succ: a => _instance_method(Enum, 'succ', a, defaultSucc)(a)

  // | the predecessor of a value.  For numeric types, 'pred' subtracts 1.
  // pred                :: a -> a
  ,pred: a => _instance_method(Enum, 'pred', a, defaultPred)(a)

  // | Convert from an 'Int'.
  // toEnum              :: Int -> a
  ,toEnum

  // | Convert to an 'Int'.
  // It is implementation-dependent what 'fromEnum' returns when
  // applied to a value that is too large to fit in an 'Int'.
  // fromEnum            :: a -> Int
  ,fromEnum

  ,_methods: {
    succ: function(){
      return Enum['succ'](this)
    }
    ,pred: function(){
      return Enum['pred'](this)
    }
    ,fromEnum: function(){
      return Enum['fromEnum'](this)
    }
  }
  ,_static_methods: {
    toEnum: function(i) {
      return Enum['toEnum'](this, i)
    }
  }
}

module.exports = Enum
