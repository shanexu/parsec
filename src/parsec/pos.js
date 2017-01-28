import { curry, reduce, isEqual } from 'lodash/fp'
import { _case, _instance, _extend } from '../utils.js'
import Ord, { compare } from '../ord.js'
import Eq from '../eq.js'
import { EQ } from '../ordering.js'

// | The abstract data type @SourcePos@ represents source positions. It
// contains the name of the source (i.e. file name), a line number and
// a column number. @SourcePos@ is an instance of the 'Show', 'Eq' and
// 'Ord' class.
export class SourcePos {
  constructor(name, line, column) {
    this.name = name
    this.line = line
    this.column = column
  }
}

_instance(Eq, SourcePos).where({
  '==': isEqual
})

_instance(Ord, SourcePos).where({
  compare: ({name: name1, line: line1, column: column1}, {name: name2, line: line2, column: column2}) =>
    _case(compare(name1, name2)).of([
       [EQ, () => _case(compare(line1, line2)).of([
          [EQ, () => compare(column1, column2)]
       ])]
    ])
})

_extend(SourcePos.prototype, Eq._methods, Ord._methods)

export let sourcePos = curry((name, line, column) => new SourcePos(name, line, column))

// | Create a new 'SourcePos' with the given source name,
// line number and column number.
// newPos :: SourceName -> Line -> Column -> SourcePos
export let newPos = sourcePos

// | Create a new 'SourcePos' with the given source name,
// and line number and column number set to 1, the upper left.
// initialPos :: SourceName -> SourcePos
export let initialPos = name => newPos(name, 1, 1)

// | Extracts the name of the source from a source position.
// sourceName :: SourcePos -> SourceName
export let sourceName = ({name}) => name

// | Extracts the line number from a source position.
// sourceLine :: SourcePos -> Line
export let sourceLine = ({line}) => line

// | Extracts the column number from a source position.
// sourceColumn :: SourcePos -> Column
export let sourceColumn = ({column}) => column

// -- | Increments the line number of a source position.
// incSourceLine :: SourcePos -> Line -> SourcePos
export let incSourceLine = curry(({name, line, column}, n) => sourcePos(name, line+n, column))

// -- | Increments the column number of a source position.
// incSourceColumn :: SourcePos -> Column -> SourcePos
export let incSourceColumn = curry(({name, line, column}, n) => sourcePos(name, line, column+n))

// -- | Set the name of the source.
// setSourceName :: SourcePos -> SourceName -> SourcePos
export let setSourceName = curry(({line, column}, n) => sourcePos(n, line, column))

// -- | Set the line number of a source position.
// setSourceLine :: SourcePos -> Line -> SourcePos
export let setSourceLine = curry(({name, column}, n) => sourcePos(name, n, column))

// -- | Set the column number of a source position.
// setSourceColumn :: SourcePos -> Column -> SourcePos
export let setSourceColumn = curry(({name, line}, n) => sourcePos(name, line, n))

// | Update a source position given a character. If the character is a
// newline (\'\\n\') or carriage return (\'\\r\') the line number is
// incremented by 1. If the character is a tab (\'\t\') the column
// number is incremented to the nearest 8'th column, ie. @column + 8 -
// ((column-1) \`mod\` 8)@. In all other cases, the column is
// incremented by 1.
//
// updatePosChar   :: SourcePos -> Char -> SourcePos
export let updatePosChar = curry(({name, line, column}, c) => _case(c).of([
   ['\n',       sourcePos(name, line+1, column)]
  ,['\t',       sourcePos(name, line, (column + 8 - ((column-1) % 8)))]
  ,[() => true, sourcePos(name, line, column+1)]
]))

// | The expression @updatePosString pos s@ updates the source position
// @pos@ by calling 'updatePosChar' on every character in @s@, ie.
// @foldl updatePosChar pos string@.
// updatePosString :: SourcePos -> String -> SourcePos
// export let updatePosChar = curry((pos, string) => reduce(updatePosChar, pos, string))
