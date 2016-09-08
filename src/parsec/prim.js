import { curry, compose } from 'lodash/fp'
import { _instance, _extend, _case } from '../utils.js'
import Functor from '../functor.js'
import M from '../monad.js'
import { newErrorUnknown, newErrorMessage, SysUnExpect, UnExpect } from './error.js'

const payload = {}

class ConsumedData {
  constructor(value) {
    this.value = value
  }
}
_instance(Functor, ConsumedData).where({
  fmap: (f, c) => _case(c).of([
    [Empty, ({value}) => new Empty(f(value))],
    [Consumed, ({value}) => new Consumed(f(value))]
  ])
})
_extend(ConsumedData.prototype, Functor._methods)
export class Consumed extends ConsumedData {}
export let Consumed_ = value => new Consumed(value)
export class Empty extends ConsumedData {}
export let Empty_ = value => new Empty(value)

class Reply {
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
export let Ok_ = curry((value, state, error) => new Ok(value, state, error))
export class Error extends Reply {
  constructor(error) {
    super(payload)
    this.error = error
  }
}
export let Error_ = error => new Error(error)

_instance(Functor, Reply).where({
  fmap: (f, r) => _case(r).of([
    [Ok,    ({value, state, error}) => Ok_(f(value), state, error)],
    [Error, ({value, state, error}) => Error_(f(value), state, error)]
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
//               -> m                                     -- monad type
//               -> (m -> a -> State s u -> ParseError -> m b) -- consumed ok
//               -> (m -> ParseError -> m b)                   -- consumed err
//               -> (m -> a -> State s u -> ParseError -> m b) -- empty ok
//               -> (m -> ParseError -> m b)                   -- empty err
//               -> m b
//              }
// we should pass type information
export class ParsecT {
  constructor(unParser) {
    this.unParser = unParser
  }
}
export let ParsecT_ = p => new ParsecT(p)
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
export let unexpected = msg => new ParsecT((m, s, cok, cerr, eok, eerr) => eerr(m, newErrorMessage(new UnExpect(msg), statePos(s))))

// | Low-level unpacking of the ParsecT type. To run your parser, please look to
// runPT, runP, runParserT, runParser and other such functions.
// runParsecT :: Monad m => m -> ParsecT s u m a -> State s u -> m (Consumed (m (Reply s u a)))
export let runParsecT = curry((m, p, s) => {
  let parser = unParser(p)
  let cok = curry((m, a, s1, err) => compose(M.return(m), Consumed_, M.return(m))(Ok_(a, s1, err)))
  let cerr = curry((m, err) => compose(M.return(m), Consumed_, M.return(m))(Error_(err)))
  let eok = curry((m, a, s1, err) => compose(M.return(m), Empty_, M.return(m))(Ok_(a, s1, err)))
  let eerr = curry((m, err) => compose(M.return(m), Empty_, M.return(m))(Error_(err)))
  return parser(m)(s, cok, cerr, eok, eerr)
})

// | Low-level unpacking of the ParsecT type. To run your parser, please look to
// runPT, runP, runParserT, runParser and other such functions.
// runParsecT :: Monad m => ParsecT s u m a -> State s u -> m (Consumed (m (Reply s u a)))
export let mkPT = (m, k) =>
  ParsecT_(
    (m, s, cok, cerr, eok, eerr) =>
      k(s) ['>>='] (cons => _case(cons).of([
        [Consumed,
         ({value:mrep}) => mrep ['>>='] (
           rep => _case(rep).of([
             [Ok,    ({value:x, state:s1, error:err}) => cok(m, x, s1, err)],
             [Error, ({error:err}) => cerr(m, err)]
           ]))],
        [Empty,
         ({value:mrep}) => mrep ['>>='] (
           rep => _case(rep).of([
             [Ok,    ({value:x, state:s1, error:err}) => eok(m, x, s1, err)],
             [Error, ({error:err}) => eerr(m, err)]
           ])
         )]
      ]))
  )
