type CompareResult = 'equal' | 'unequal' | 'sublist' | 'superlist'
type Indexable = string | number | symbol

function boyerMore<T extends Indexable>(
  haystack: Array<T>,
  needle: Array<T>
): number {
  const nLen = needle.length
  const hLen = haystack.length
  const badMatchTable: { [key in T]?: number } = {}
  for (let i = 0; i < nLen; ++i) {
    badMatchTable[needle[i]] = nLen - i - 1
  }

  const getSkipIndex = (c: T): number => badMatchTable[c] || nLen

  let j = nLen - 1
  while (j < hLen) {
    let k = nLen - 1
    let ij = j
    while (k >= 0) {
      const hChar = haystack[ij]
      const nChar = needle[k]
      if (hChar === nChar) {
        // Match
        if (k === 0) {
          return ij
        }
        k--
        ij--
      } else {
        const skip = getSkipIndex(hChar)
        j += skip
        break
      }
    }
  }

  return -1
}

export class List {
  #list: Array<number>

  constructor(...list: Array<number>) {
    this.#list = list
  }

  isEmpty() {
    return this.#list.length === 0
  }

  indexOf(list: List) {
    return boyerMore(this.#list, list.#list)
  }

  compare(list: List): CompareResult {
    if (this.isEmpty() && list.isEmpty()) {
      return 'equal'
    } else if (this.isEmpty() && !list.isEmpty()) {
      return 'sublist'
    } else if (!this.isEmpty() && list.isEmpty()) {
      return 'superlist'
    }

    if (this.#list.length === list.#list.length) {
      const index = this.indexOf(list)
      if (index === 0) {
        return 'equal'
      }
    } else if (this.#list.length > list.#list.length) {
      const index = this.indexOf(list)
      if (index > -1) {
        return 'superlist'
      }
    } else if (this.#list.length < list.#list.length) {
      const index = list.indexOf(this)
      if (index > -1) {
        return 'sublist'
      }
    }

    return 'unequal'
  }
}
