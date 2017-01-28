import { sortBy, curry, filter, isEmpty, concat } from 'lodash/fp'
import { _instance, _case, _extend } from '../utils.js'
import Enum, { fromEnum } from '../Enum.js'
import Eq from '../eq.js'
import Ord, { compare } from '../Ord.js'
import { LT, EQ, GT } from '../ordering.js'

export class MessageData {
  constructor(s) {
    this.s = s
  }
}
export class Message extends MessageData {}
export class SysUnExpect extends MessageData {}
export class UnExpect extends MessageData {}
export class Expect extends MessageData {}

_instance(Enum, MessageData).where({
  fromEnum: m => _case(m).of([
     [SysUnExpect, () => 0]
    ,[UnExpect,    () => 1]
    ,[Expect,      () => 2]
    ,[Message,     () => 3]
  ])
  ,toEnum: () => { throw new Error('toEnum is undefined for Message') }
})

_instance(Eq, MessageData).where({
  '==': (m1, m2) => fromEnum(m1) === fromEnum(m2)
})

_instance(Ord, MessageData).where({
  compare: (m1, m2) => compare(fromEnum(m1), fromEnum(m2))
})

_extend(MessageData.prototype, Enum._methods, Eq._methods)
_extend(MessageData, Enum._static_methods, Eq._static_methods)

// | Extract the message string from an error message
// messageString :: Message -> String
export let messageString = ({s}) => s

// | The abstract data type @ParseError@ represents parse errors. It
// provides the source position ('SourcePos') of the error
// and a list of error messages ('Message'). A @ParseError@
// can be returned by the function 'Text.Parsec.Prim.parse'. @ParseError@ is an
// instance of the 'Show' and 'Eq' classes.
export class ParseError {
  constructor(pos, msgs) {
    this.pos = pos
    this.msgs = msgs
  }
}

// | Extracts the source position from the parse error
// errorPos :: ParseError -> SourcePos
export let errorPos = ({pos}) => pos

// | Extracts the list of error messages from the parse error
// errorMessages :: ParseError -> [Message]
export let errorMessages = ({msgs}) => sortBy(fromEnum, msgs)

// errorIsUnknown :: ParseError -> Bool
export let errorIsUnknown = ({msgs}) => isEmpty(msgs)

// < Create parse errors
// newErrorUnknown :: SourcePos -> ParseError
export let newErrorUnknown = pos => new ParseError(pos, [])

// newErrorMessage :: Message -> SourcePos -> ParseError
export let newErrorMessage = curry((msg, pos) => new ParseError(pos, [msg]))

// addErrorMessage :: Message -> ParseError -> ParseError
export let addErrorMessage = curry((msg, {pos, msgs}) => new ParseError(pos, [msg, ...msgs]))

// setErrorPos :: SourcePos -> ParseError -> ParseError
export let setErrorPos = curry((pos, {msgs}) => new ParseError(pos, msgs))

// setErrorMessage :: Message -> ParseError -> ParseError
export let setErrorMessage = curry((msg, {pos, msgs}) => new ParseError(pos, [msg, ...filter((msg)['/='], msgs)]))

// mergeError :: ParseError -> ParseError -> ParseError
export let mergeError = (e1, e2) => {
  let {pos: pos1, msgs: msgs1} = e1,
      {pos: pos2, msgs: msgs2} = e2
  if(isEmpty(msgs2) && !isEmpty(msgs1)) return e1
  if(isEmpty(msgs1) && !isEmpty(msgs2)) return e2
  return _case((pos1) ['compare'] (pos2)).of([
     [EQ, () => new ParseError(pos1, concat(msgs1, msgs2))]
    ,[GT, () => e1]
    ,[LT, () => e2]
  ])
}
// mergeError e1@(ParseError pos1 msgs1) e2@(ParseError pos2 msgs2)
