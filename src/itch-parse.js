const fs = require('fs')
const path = require('path')
const createCSVWriter = require('csv-writer').createObjectCsvWriter

/**
 * @enum {string}
 */
const PLATFORMS = {
  WINDOWS: 'windows',
  OSX: 'osx',
  LINUX: 'linux'
}

/**
 * @enum {string}
 */
const CLASSIFICATIONS = {
  GAME: 'game',
  PHYSICAL_GAME: 'physical_game',
  COMIC: 'comic',
  BOOK: 'book',
  ASSETS: 'assets',
  SOUNDTRACK: 'soundtrack',
  TOOL: 'tool',
  OTHER: 'other'
}

/**
 * @typedef {Object} ItchRecord
 * @property {number} id
 * @property {{
 *  created_at: string,
 *  position: number
 * }} bundle_game
 * @property {string} url
 * @property {PLATFORMS[]} platform
 * @property {{
 * url: string,
 * name: string,
 * id: number
 * }} user
 * @property {string} title
 * @property {string} cover
 * @property {string} cover_color
 * @property {CLASSIFICATIONS} classification
 * @property {string} short_text
 * @property {string} price
 * 
 */

/**
 * @returns {ItchRecord[]}
 */
const getBundleList = fullPath => {
  const gamesDataFile = fs.readFileSync(fullPath)
  const { games } = JSON.parse(gamesDataFile)
  return games
}


/**
 *
 */
const parseArgs = args => {
  if (!args || args.length < 3) {
    console.error('JSON file required')
    process.exit(1)
  }
  const jsonLoc = args[2]
  return jsonLoc
}

/**
 * @param {ItchRecord[]}
 * @returns {ItchRecord}
 */
const getVideoGameList = fullList => {
  return fullList.filter(game => game.classification === CLASSIFICATIONS.GAME)
}

/**
 *
 */
const main = jsonPath => {
  jsonPath = path.resolve(__dirname, jsonPath)
  const games = getBundleList(jsonPath)
  const videoGames = getVideoGameList(games).map(g => ({
    title: g.title,
    platform: 'PC',
    owned: true,
    status: 'Unplayed'
  }))
  // lets build the csv
  const csvWriter = createCSVWriter({
    path: path.resolve(__dirname, '../dist/world-land-trust.csv'),
    header: [
      { id: 'title', title: 'TITLE' },
      { id: 'platform', title: 'PLATFORM' },
      { id: 'owned', title: 'OWNED' },
      { id: 'status', title: 'STATUS' }
    ]
  })
  csvWriter.writeRecords(videoGames)
  console.log(videoGames)
}

main(parseArgs(process.argv))