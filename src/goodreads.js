const { getRecords, parseArgs, formatRecord } = require('./utils')

/**
 * @typedef {Object} Book
 * @property {string} Title
 * @property {string} DateRead
 * @property {string} NumberOfPages
 */

const headerKeys = {
  TITLE: 'Title',
  DATE_READ: 'Date Read',
  NUMBER_OF_PAGES: 'Number of Pages'
}

/**
 * @param {Array[]} data
 * @param {string} year
 * @returns
 */
const formattedBookListParser = (data, year) => {
  const headers = data[0]
  const dateReadIndex = headers.indexOf(headerKeys.DATE_READ)
  const yearBooksAsObjs = []
  data.forEach((book, index) => {
    const bookIsForYear = book[dateReadIndex].includes(year)
    if (index === 0 || !bookIsForYear) {
      return
    }
    const bookObj = formatRecord(book, headers)
    yearBooksAsObjs.push(bookObj)
  })
  return yearBooksAsObjs
}

/**
 * @param {Book[]} books
 * @param {string} year
 */
const printTotalBookInfo = (books, year) => {
  const titleList = []
  let totalPages = 0
  books.forEach(book => {
    const bookPageCount = parseInt(book[headerKeys.NUMBER_OF_PAGES])
    totalPages += bookPageCount
    titleList.push(book[headerKeys.TITLE])
  })

  const separator = '====================================='
  const newLine = '\n'
  console.log(newLine)
  console.log(separator)
  console.log('You read', books.length, 'books in ', year, '.')
  console.log('~', Math.floor(books.length / 12), 'books a month.')
  console.log(newLine)
  console.log('For a total of', totalPages, 'pages.')
  console.log('~', Math.floor(totalPages / 365), 'pages a day.')
  console.log(separator)
  console.log(newLine)
}

/**
 * @param {{
 *  csvPath: string,
 *  year: string
 * }} args
 */
const main = async args => {
  const [csvPath, year] = args
  if (!year) {
    console.error('A year is required')
    process.exit(1)
  }
  const records = await getRecords(csvPath)
  const books = formattedBookListParser(records, year)
  printTotalBookInfo(books, year)

  process.exit(0)
}

main(parseArgs(process.argv))
