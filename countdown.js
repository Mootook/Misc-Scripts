/**
 * @param {Date} d1
 * @param {Date} d2
 * @returns {Number}
 */
const dateDiffInDays = (d1, d2) => {
  const t1 = d1.getTime()
  const t2 = d2.getTime()

  return parseInt((t2 - t1) / (24 * 3600 * 1000))
}

/**
 *
 * @param {String[]} args
 * @returns {{
 * targetDate: string
 * }}
 */
const parseArgs = args => {
  const [targetDateString, message] = args.filter((_, i) => i > 1)
  return {
    targetDateString,
    message
  }
}

/**
 * 
 * @param {number} length
 * @param {string} char 
 * 
 * @returns {string}
 */
const getLogSeparator = (length, char = '/') => {
  const ret = []
  for (let i = 0; i < length; i++) {
    ret.push(char)
  }
  return ret.join('')
}

const main = args => {
  const { targetDateString, message = '' } = args
  const targetDate = new Date(targetDateString)
  const daysLeft = dateDiffInDays(new Date(), targetDate)

  const spit = `You have ${daysLeft} days to finish ${message}!`
  const separatorLength = spit.length
  const separator = getLogSeparator(separatorLength, '-')

  console.log('\n')
  console.log(separator)
  console.log(spit)
  console.log(separator)
  console.log('\n')

  return process.exit(0)
}

main(parseArgs(process.argv))
