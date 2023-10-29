const { parseArgs } = require("./utils");
const fs = require("fs");

/**
 * Given a directory, iterative over .md file
 * and add the "melee" tag to the list of metadata and, for
 * any existing tags, prepend melee/ so that it is a nested tag.
 *
 * @example
 * ```bash
 * node ./src/obsidian_scratchpad.js c:/some/dir
 * ```
 */
function addMeleeTagToAllFiles(path) {
  const basePath = "C:\\Users\\alex\\Utils\\Misc-Scripts\\local\\Melee";
  const rootPaths = fs.readdirSync(path);
  for (const c of rootPaths) {
    // going to need to recursively do this on every dir
    // until none are present
    // const 
  }
}

function main(args) {
  const [path] = args;
  if (!path) {
    console.error("Path required");
    process.exit(1);
  }
  addMeleeTagToAllFiles(path);
}

main(parseArgs(process.argv));
