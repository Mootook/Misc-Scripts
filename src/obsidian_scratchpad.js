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
      ensureTagsInFrontMatter(p);
    }
  }

  function ensureTagsInFrontMatter(fullFilePath) {
    // console.log("<<<", fullFilePath, ">>>");
    const pattern = /\B(\#[a-zA-Z/]+\b)/g;
    let content = fs.readFileSync(fullFilePath).toString();
    let tags = content.match(pattern) ?? [];
    const frontMatterPattern = /---\n.*?\n---/s;
    // console.log("Tags", tags);
    const [fm] = content.match(frontMatterPattern) ?? [];
    if (fm) {
      if (fm.includes("tags:")) {
        tags = content
          .substring(fm.indexOf("tags:") + 7, content.indexOf("---", 1))
          .split("\n")
          .filter((t) => t != "")
          .map((t) => {
            const pruned = t.replace("-", "").trim();
            let r = pruned;
            if (!r.includes("melee")) {
              r = "melee/" + pruned;
            }
            return r;
          });
        if (!tags.includes("melee")) {
          tags.unshift("melee");
        }

        const newFm = fm.replace(
          fm.substring(fm.indexOf("tags:"), fm.indexOf("---", 1)),
          "tags:\n" + tags.map((t) => "  - " + t).join("\n") + "\n"
        );

        if (fm.includes("Captain Falcon vs. Falco")) {
          console.log("Before:");
          console.log(fm);
          console.log("\nAfter:");
        }
        content = content.replace(fm, newFm);
        content = content.replace(new RegExp("#melee", "g"), "");
        if (fm.includes("Captain Falcon vs. Falco")) {
          console.log(content);
        }
      } else {
        // console.log("NO tags keys\n");
        const indexOfEndOfFM = fm.indexOf("---", 1);
        // console.log("Before:");
        // console.log(fm);
        tags = tags.map((t) => t.replace("#", "")).filter((t) => t !== "melee");
        tags.unshift("melee");
        tags = tags.map((t) => "  - " + t).join("\n") + "\n";
        const newFm =
          fm.substring(0, indexOfEndOfFM) +
          "tags:\n" +
          tags +
          fm.substring(indexOfEndOfFM);
        content = content.replace(fm, newFm);
        content = content.replace("#melee", "");
        // console.log("After:");
        // console.log(newFm);
      }
    } else {
      // console.log("Before:");
      // console.log(content);
      const newFm = "---\n" + "tags:\n" + "  - melee\n" + "---\n";
      content = newFm + content;
      content = content.replace("#melee", "");
      // console.log("After:");
      // console.log(content);
    }
    writeNewContent(content, fullFilePath);
  }

  function writeNewContent(content, fullPath) {
    const newPath = fullPath.replace(basePathMac, output);
    const newDir = path.dirname(newPath);
    if (!fs.existsSync(newDir)) {
      fs.mkdirSync(newDir, { recursive: true });
    }
    console.log("Writing to ", newPath);
    console.log(content);
    fs.writeFileSync(newPath, content, { encoding: "utf-8" });
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
    writeNewContent(content, fullFilePath);
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
