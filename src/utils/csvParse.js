const fs = require('fs')
const { parse } = require('csv-parse')

const getRecords = async path => {
  const parser = parse({ delimiter: ',' })
  fs.createReadStream(path).pipe(parser)
  const records = []
  for await (const record of parser) {
    records.push(record)
  }

  return records
}

module.exports = {
  getRecords
}
