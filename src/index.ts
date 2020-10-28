export type NONE = 'none'
export type Value = number | string | object | boolean | null | undefined | Value[]
export type Element = Value

export type Recognizer = (c: string) => boolean

const NONE: NONE = 'none'
const SPACE_CHAR_LIST = [' ', '\n', '\r']

const Char = (c: string) => c.charCodeAt(0)

const isDigit: Recognizer = (c: string) => Char(c) >= Char('0') && Char(c) <= Char('9')

const isOneNine : Recognizer = (c: string) => Char(c) >= Char('1') && Char(c) <= Char('9')

const isSpace: Recognizer = (c: string) => SPACE_CHAR_LIST.includes(c)

const isSpecificChar = (expectation: string) => (current: string) => Char(current) === Char(expectation)

const isDoubleQuote = isSpecificChar('"')
const isComma = isSpecificChar(',')
const isColon = isSpecificChar(':')
const isStartCurlyBracket = isSpecificChar('{')
const isEndCurlyBracket = isSpecificChar('}')
const isStartSquareBracket = isSpecificChar('[')
const isEndSquareBracket = isSpecificChar(']')

const isNotSpecificChar = (expectation: string) => (current: string) => Char(current) !== Char(expectation)

const isNotDoubleQuote = isNotSpecificChar('"')

export default function parse(jsonStr: string) {
    let forward = 0
    let buf = ''
    let line = 0

    const pass = () => {
        forward += 1
    }

    const passWord = (word: string) => {
        forward += word.length
    }


    const nextWord = () => {
        buf = ''
    }

    const one = (recognizer: Recognizer) => {
        if (forward < jsonStr.length && recognizer(jsonStr[forward])) {
            buf += jsonStr[forward]
            pass()
        }
    }

    const some = (recognizer: Recognizer) => {
        while (forward < jsonStr.length) {
            if (recognizer(jsonStr[forward])) {
                buf += jsonStr[forward]
            } else {
                break
            }
            pass()
        }
    }

    const space = () => {
        some(isSpace)
        nextWord()
    }

    const char = (recognizer: Recognizer) => {
        if (forward < jsonStr.length && recognizer(jsonStr[forward])) {
            pass()
            return true
        } else {
            return false
        }
    }

    const word = (w: string) => {
        if (jsonStr.slice(forward, forward + w.length) === w) {
            passWord(w)
            return true
        } else {
            return false
        }
    }

    const matchInteger = () => {
        let int: number | NONE = NONE

        one(isOneNine)
        if (buf.length > 0) {
            some(isDigit)
        } else {
            one(isDigit)
        }

        if (buf === '') {
            int = NONE
        } else {
            int = parseInt(buf)
        }
        
        nextWord()
        return int
    }

    const matchString = () => {
        const start = char(isDoubleQuote)
        if (!start) return NONE

        some(isNotDoubleQuote)
        const str = buf
        nextWord()

        const end = char(isDoubleQuote)
        if (!end) return NONE

        return str
    }

    const matchTrue = () => {
        return word('true') ? true : NONE
    }

    const matchFalse = () => {
        return word('false') ? false : NONE
    }

    const matchNull = () => {
        return word('null') ? null : NONE
    }

    const matchUndefined = () => {
        return word('undefined') ? undefined : NONE
    }

    const matchObject = () => {
        const start = char(isStartCurlyBracket)
        if (!start) return NONE

        const obj = matchMembers()
        if (obj === NONE) return NONE

        const end = char(isEndCurlyBracket)
        if (!end) return NONE
        return obj
    }

    const matchArray = () => {
        const start = char(isStartSquareBracket)
        if (!start) return NONE

        const arr = matchElements()
        if (arr === NONE) return NONE

        const end = char(isEndSquareBracket)
        if (!end) return NONE

        return arr
    }

    const matchValue = () => {
        let value: Value | NONE = NONE

        switch(jsonStr[forward]) {
            case '{':
                value = matchObject()
                break
            case '[':
                value = matchArray()
                break
            case '"':
                value = matchString()
                break
            case 't':
                value = matchTrue()
                break
            case 'f':
                value = matchFalse()
                break
            case 'n':
                value = matchNull()
                break
            case 'u':
                value = matchUndefined()
                break
            default:
                if (isDigit(jsonStr[forward])) {
                    value = matchInteger()
                }
        }
        return value
    }

    const matchElement = (): Element => {
        space()
        const value = matchValue()
        space()
        return value
    }

    const matchElements = () => {
        let elements: Element[] = []

        while(true) {
            const element = matchElement()
            if (element !== NONE) {
                elements.push(element)

                const result = char(isComma)
                if (result) {
                    continue
                } else {
                    break
                }
            } else {
                return NONE
            }
        }

        return elements
    }

    const matchMember = () => {
        let key: string | NONE = NONE
        let element: Element | NONE = NONE
        space()
        
        key = matchString()
        if (key === NONE) return NONE

        space()

        const result = char(isColon)
        if (!result) return NONE

        element = matchElement()
        if (element === NONE) return NONE

        return [key, element] as const
    }

    const matchMembers = () => {
        let members: Record<string, Value> = {}

        while(true) {
            const member = matchMember()
            if (member !== NONE) {
                const [key, value] = member
                members[key] = value

                const result = char(isComma)
                if (result) {
                    continue
                } else {
                    break
                }
            } else {
                return NONE
            }
        }

        return members
    }

    return matchObject()
}