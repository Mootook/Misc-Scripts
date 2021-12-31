const csvParse = require('./csvParse')
const argsUtils = require('./parseArgs')
const { formatRecord } = require('./formatRecord')

module.exports = {
  getRecords: csvParse.getRecords,
  parseArgs: argsUtils.parseArgs,
  formatRecord
}