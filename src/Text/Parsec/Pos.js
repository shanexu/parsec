import {
  curry
} from 'lodash/fp'
import {
  _instance,
  _extend,
  _case,
  otherwise
} from 'utils'
import * as Show from 'Text/Show'
import {
  show
} from 'Text/Show'

export class SourcePos {
  constructor(name, line, column) {
    this.name = name
    this.line = line
    this.column = column
  }
}

// -- | Create a new 'SourcePos' with the given source name,
// -- line number and column number.
export let newPos = curry((name, line, column) => new SourcePos(name, line,
  column))

// -- | Create a new 'SourcePos' with the given source name,
// -- and line number and column number set to 1, the upper left.
export let initialPos = name => newPos(name, 1, 1)

// -- | Extracts the name of the source from a source position.
export let sourceName = pos => pos.name

// -- | Extracts the line number from a source position.
export let sourceLine = pos => pos.line

// -- | Extracts the column number from a source position.
export let sourceColumn = pos => pos.column

// -- | Increments the line number of a source position.
export let incSourceLine = curry(({
  name,
  line,
  column
}, n) => newPos(name, line + n, column))

// -- | Increments the column number of a source position.
export let incSourceColumn = curry(({
  name,
  line,
  column
}, n) => newPos(name, line, column + n))

// -- | Set the name of the source.
export let setSourceName = curry(({
  line,
  column
}, name) => newPos(name, line, column))

// -- | Set the line number of a source position.
export let setSourceLine = curry(({
  name,
  column
}, line) => newPos(name, line, column))

// -- | Set the column number of a source position.
export let setSourceColumn = curry(({
  name,
  line
}, column) => newPos(name, line, column))

// -- | Update a source position given a character. If the character is a
// -- newline (\'\\n\') or carriage return (\'\\r\') the line number is
// -- incremented by 1. If the character is a tab (\'\t\') the column
// -- number is incremented to the nearest 8'th column, ie. @column + 8 -
// -- ((column-1) \`mod\` 8)@. In all other cases, the column is
// -- incremented by 1.

// updatePosChar   :: SourcePos -> Char -> SourcePos
// updatePosChar (SourcePos name line column) c
//     = case c of
//         '\n' -> SourcePos name (line+1) 1
//         '\t' -> SourcePos name line (column + 8 - ((column-1) `mod` 8))
//         _    -> SourcePos name line (column + 1)
export let updatePosChar = ({
    name,
    line,
    column
  }, c) =>
  _case(c)
  .of([
    ['\n', () => newPos(name, line + 1, 1)],
    ['\t', () => newPos(name, line, (column + 8 - ((column - 1) % 8)))],
    [otherwise, () => newPos(name, line, column + 1)]
  ])

_instance(Show, SourcePos)
  .where({
    'show': ({
      name,
      line,
      column
    }) => {
      let showLineColumn = () =>
        '(line ' + show(line) +
        ', column ' + show(column) +
        ')'
      return _case(name)
        .of([
          [null, () => showLineColumn()],
          [otherwise, () => '"' + name + '"' + showLineColumn()]
        ])
    }
  })
_extend(SourcePos.prototype, Show._methods)
