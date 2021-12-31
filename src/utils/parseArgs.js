/**
 * 
 * @param {string[]} args 
 * @returns 
 */
const parseArgs = args => args.filter((_, i) => i > 1)

module.exports = {
  parseArgs
}
