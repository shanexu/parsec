import { curry } from 'lodash/fp'
import { _instance, _extend, _case } from '../utils.js'
import Functor from '../functor.js'
import { newErrorUnknown, newErrorMessage, SysUnExpect } from './error.js'

const payload = {}

export class Consumed {
  constructor(value) {
    this.value = value
  }
}
_instance(Functor, Consumed).where({
  fmap: (f, c) => _case(c).of([
    [Empty, ({value}) => new Empty(f(value))],
    [Consumed, ({value}) => new Consumed(f(value))]
  ])
})
_extend(Consumed.prototype, Functor._methods)

export class Empty extends Consumed {}

export class Reply {
  constructor(x) {
    if(x !== payload) {
      throw new TypeError('Reply is an abstract class')
    }
  }
}

export class Ok extends Reply {
  constructor(value, state, error) {
    super(payload)
    this.value = value
    this.state = state
    this.error = error
  }
}

export class Error extends Reply {
  constructor(error) {
    super(payload)
    this.error = error
  }
}
_instance(Functor, Reply).where({
  fmap: (f, r) => _case(r).of([
    [Ok,    ({value, state, error}) => new Ok(f(value), state, error)],
    [Error, ({value, state, error}) => new Error(f(value), state, error)]
  ])
})
_extend(Reply.prototype, Functor._methods)

export class State {
  constructor(stateInput, statePos, stateUser) {
    this.stateInput = stateInput
    this.statePos = statePos
    this.stateUser = stateUser
  }
}

export let statePos = ({statePos}) => statePos

// | ParserT monad transformer and Parser type
//
// | @ParsecT s u m a@ is a parser with stream type @s@, user state type @u@,
// underlying monad @m@ and return type @a@.  Parsec is strict in the user state.
// If this is undesirable, simply used a data type like @data Box a = Box a@ and
// the state type @Box YourStateType@ to add a level of indirection.
//
// newtype ParsecT s u m a
//     = ParsecT {unParser :: forall b .
//                  State s u
//               -> (a -> State s u -> ParseError -> m b) -- consumed ok
//               -> (ParseError -> m b)                   -- consumed err
//               -> (a -> State s u -> ParseError -> m b) -- empty ok
//               -> (ParseError -> m b)                   -- empty err
//               -> m b
//              }
export class ParsecT {
  constructor(unParser) {
    this.unParser = unParser
  }
}
export let unParser = ({unParser}) => unParser

// unknownError :: State s u -> ParseError
export let unknownError = state => newErrorUnknown(statePos(state))

// sysUnExpectError :: String -> SourcePos -> Reply s u a
export let sysUnExpectError = curry((msg, pos) => new Error(newErrorMessage(new SysUnExpect(msg), pos)))

// | The parser @unexpected msg@ always fails with an unexpected error
// message @msg@ without consuming any input.
//
// The parsers 'fail', ('<?>') and @unexpected@ are the three parsers
// used to generate error messages. Of these, only ('<?>') is commonly
// used. For an example of the use of @unexpected@, see the definition
// of 'Text.Parsec.Combinator.notFollowedBy'.
// unexpected :: (Stream s m t) => String -> ParsecT s u m a
