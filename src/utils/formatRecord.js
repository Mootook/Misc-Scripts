/**
 * @param {string[]} record 
 * @param {string[]} headerList 
 * @returns 
 */
const formatRecord = (record, headerList) => {
  const retVal = {}
  record.forEach((val, index) => {
    retVal[headerList[index]] = val
  })
  return retVal
}

module.exports = {
  formatRecord
}