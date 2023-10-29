const { parseArgs } = require("./utils");
const fs = require("fs");
const path = require("path");

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
function addMeleeTagToAllFiles(requestedPath) {
  const basePathWin = "C:\\Users\\alex\\Utils\\Misc-Scripts\\local\\Melee";
  const basePathMac = "/Users/alexandermutuc/Utils/Scripts/local/Melee";
  const output = path.resolve(__dirname, "../dist");
  if (!fs.existsSync(output)) {
    fs.mkdirSync(output);
  }
  function digForMD(p) {
    const stats = fs.statSync(p);
    if (stats.isDirectory()) {
      const paths = fs.readdirSync(p);
      for (const c of paths) {
        digForMD(path.join(p, c));
      }
    } else if (path.extname(p) === ".md" && !p.includes("VOD Library")) {
      findAndReplaceTagsInFile(p);
    }
  }
  function findAndReplaceTagsInFile(fullFilePath) {
    // Gets every #word
    const tag = "#melee";
    const pattern = /\B(\#[a-zA-Z]+\b)/g;
    let content = fs.readFileSync(fullFilePath).toString();
    const tags = content.match(pattern) ?? [];
    tags.forEach((t) => {
      content = content.replace(t, tag + "/" + t.replace("#", ""));
    });
    // add to end of front matter
    // if there is any
    const fmd = "---";
    if (content.includes(fmd)) {
      const b = content.indexOf(fmd);
      const e = content.indexOf(fmd, b + 1);
      content = content.slice(0, e + 3) + "\n" + tag + content.slice(e + 3);
    } else {
      content += "\n" + tag;
    }
    console.log("<<<", fullFilePath, ">>>");
    console.log(content);
    const newPath = fullFilePath.replace(basePathMac, output);
    console.log("New File Path: " + newPath);
    const newDir = path.dirname(newPath);
    console.log(newDir);
    if (!fs.existsSync(newDir)) {
      fs.mkdirSync(newDir, { recursive: true });
    }
    fs.writeFileSync(newPath, content, { encoding: "utf-8" });
  }
  digForMD(requestedPath);
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
