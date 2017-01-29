// http://hackage.haskell.org/package/parsec-3.1.11/docs/src/Text.Parsec.Prim.html

import { curry, compose } from 'lodash/fp'
import { _instance, _extend, _case } from '../utils.js'
import Functor from 'Data/Functor.js'
import Applicative from '../Applicative.js'
import M from '../Monad.js'
import Identity from '../Identity.js'
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
_extend(ConsumedData, Functor._static_methods)
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
_extend(Reply, Functor._static_methods)

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
//               -> (m -> a -> State s u -> ParseError -> m b) -- consumed ok
//               -> (m -> ParseError -> m b)                   -- consumed err
//               -> (m -> a -> State s u -> ParseError -> m b) -- empty ok
//               -> (m -> ParseError -> m b)                   -- empty err
//               -> m b
//              }
// we should pass type information
export class ParsecT {
  constructor(m, unParser) {
    this.m = m
    this.unParser = unParser
  }
}
export let ParsecT_ = curry((m, p) => new ParsecT(m, p))
export let unParser = ({unParser}) => unParser

// parsecMap :: (a -> b) -> ParsecT s u m a -> ParsecT s u m b
export let parsecMap = curry((f, p) => ParsecT_((m, s, cok, cerr, eok, eerr) => unParser(p)(m, s, compose(cok, f), cerr, compose(eok, f), eerr)))

_instance(Functor, ParsecT).where({
  fmap: (f, p) => parsecMap(f, p)
})


// parserReturn :: a -> ParsecT s u m a
export let parserReturn = x => ParsecT_((m, s, cok, cerr, eok, eerr) => eok(m.return(x), s, unknownError(s)))

// parserBind :: ParsecT s u m a -> (a -> ParsecT s u m b) -> ParsecT s u m b
export let parserBind = (f, k) => ParsecT_((m, s, cok, cerr, eok, eerr) => {
// todo
})

_instance(M, ParsecT).where({
  return: x => parserReturn(x)
})

// _instance(Applicative, ParsecT).where({
//   pure:
// })

_extend(ParsecT.prototype, Functor._methods)
_extend(ParsecT, Functor._static_methods)

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
export let runParsecT = curry((p, s) => {
  let m = p.m
  let parser = unParser(p)
  let cok = curry((m, a, s1, err) => compose(M.return(m), Consumed_, M.return(m))(Ok_(a, s1, err)))
  let cerr = curry((m, err) => compose(M.return(m), Consumed_, M.return(m))(Error_(err)))
  let eok = curry((m, a, s1, err) => compose(M.return(m), Empty_, M.return(m))(Ok_(a, s1, err)))
  let eerr = curry((m, err) => compose(M.return(m), Empty_, M.return(m))(Error_(err)))
  return parser(m)(s, cok, cerr, eok, eerr)
})

// | Low-level creation of the ParsecT type. You really shouldn't have to do this.
// mkPT :: Monad m => (State s u -> m (Consumed (m (Reply s u a)))) -> ParsecT s u m a
export let mkPT = curry((m, k) => ParsecT_(
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
))

export class Parsec extends ParsecT {
  constructor(unParser) {
    super(Identity, unParser)
  }
}
// export let ParsecT_ = unParser => new Parsec(unParser)
