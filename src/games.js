const { parseArgs, getRecords, formatRecord } = require('./utils')

/**
 *
 * @param {Array[]} records
 * @param {string} year
 * @returns {Game[]}
 */
const formatRecordsAsGames = (records, year) => {
  const headerIndex = 2
  const headers = records[headerIndex]
  const dateCompletedIndex = headers.indexOf('Completion Date')
  const games = []
  records.forEach((game, index) => {
    const gameRegardsYear = game[dateCompletedIndex].includes(year)
    if (index <= headerIndex || !gameRegardsYear) {
      return
    }
    games.push(formatRecord(game, headers))
  })
  return games
}

/**
 * @param {Game[]} games
 */
const printTotalGamesInfo = (games, year) => {
  const separator = '====================================='
  const newLine = '\n'
  const getCountByPlatform = platform =>
    games.filter(game => game.Platform.includes(platform)).length

  console.log(newLine)
  console.log(separator)
  console.log('You beat', games.length, 'games in', year)
  console.log('PC: ', getCountByPlatform('PC'))
  console.log('Switch: ', getCountByPlatform('Switch'))
  console.log(
    'Playstation:',
    getCountByPlatform('PS5') +
      getCountByPlatform('PS4') +
      getCountByPlatform('Playstation')
  )
  console.log(separator)
  console.log(newLine)
}

/**
 *
 * @param {string[]} args
 *
 * @example
 * ```bash
 * node ./games.js `realpath ./spreadsheet.csv` 2021
 * ```
 */
const main = async args => {
  const [path, year] = args
  if (!path || !year) {
    console.log('Absolute path and year are required as args')
  }
  const records = await getRecords(path)
  const games = formatRecordsAsGames(records, year)
  printTotalGamesInfo(games, year)

  process.exit(0)
}

main(parseArgs(process.argv))
