const { parse } = require('csv-parse')
const fs = require('fs')

const headerKeys = {
  TITLE: 'Title',
  DATE_READ: 'Date Read',
  NUMBER_OF_PAGES: 'Number of Pages'
}

/**
 * @param {String[]} book
 * @param {String[]} headerList
 * @returns {Book}
 */
const bookToObj = (book, headerList) => {
  const retVal = {}
  book.forEach((val, index) => {
    retVal[headerList[index]] = val
  })
  return retVal
}

/**
 * @param {?Error} err
 * @param {Array[]} data
 * @returns
 */
const formattedBookListParser = (data, year) => {
  const headers = data[0]
  const dateReadIndex = headers.indexOf(headerKeys.DATE_READ)
  const yearBooksAsObjs = []
  let totalPages = 0
  const titleLists = []
  data.forEach((book, index) => {
    const bookIsForYear = book[dateReadIndex].includes(year)
    if (index === 0 || !bookIsForYear) {
      return
    }
    const bookObj = bookToObj(book, headers)
    const bookPageCount = parseInt(bookObj[headerKeys.NUMBER_OF_PAGES])
    totalPages += bookPageCount

    titleLists.push(bookObj[headerKeys.TITLE])

    yearBooksAsObjs.push(bookObj)
  })
  return yearBooksAsObjs
}

/**
 * @param {*} books
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
 *
 * @param {String[]} args
 * @returns {{
 *  csvPath: string,
 *  year: string
 * }}
 */
const parseArgs = args => {
  const [csvPath, year] = args.filter((_, i) => i > 1)
  return {
    csvPath,
    year
  }
}

/**
 * @param {{
 *  csvPath: string,
 *  year: string
 * }} args
 */
const main = async args => {
  const { csvPath, year } = args
  if (!year) {
    console.error('A year is required')
    process.exit(1)
  }
  const parser = parse({ delimiter: ',' })
  fs.createReadStream(csvPath).pipe(parser)

  const records = []
  for await (const record of parser) {
    records.push(record)
  }
  const books = formattedBookListParser(records, year)
  printTotalBookInfo(books, year)

  process.exit(0)
}

main(parseArgs(process.argv))
