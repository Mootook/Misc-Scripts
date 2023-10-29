const path = require("path");
const fs = require("fs");
const { parseArgs, getRecords, formatRecord } = require("./utils");
const CSV_PATH = path.resolve(__dirname, "../local/Game Tracker - Games.csv");
const DESTINATION_DIR = path.resolve(__dirname, "../obsidian_output");

async function run() {
  if (fs.existsSync(DESTINATION_DIR)) {
    fs.rmSync(DESTINATION_DIR, { recursive: true, force: true });
  }
  fs.mkdirSync(DESTINATION_DIR);

  const records = await getRecords(CSV_PATH);
  // remove title
  records.shift();
  // remove deadspace
  records.shift();
  // remove headers
  records.shift();

  const length = records.length;
  const recordHeaders = [
    "title",
    "platform",
    "owned",
    "status",
    "date_started",
    "date_completed",
    "rating",
    "play_type",
    "thoughts",
  ];

  for (let i = 0; i < length; i++) {
    const r = records[i];
    const f = formatRecord(records[i], recordHeaders);
    if (f.title) {
      const asFrontMatterDelimeter = "---";
      let frontMatter = asFrontMatterDelimeter + "\n";

      for (key of recordHeaders) {
        if (key === "title") {
          frontMatter += `title: "${f.title}"\n`;
        } else if (key !== "thoughts") {
          frontMatter += `${key}: ${f[key]}\n`;
        }
      }

      frontMatter += "tags: game" + "\n";
      frontMatter += asFrontMatterDelimeter;

      const content = f.thoughts;
      const fileData = frontMatter + "\n" + content;
      // remove special characters from title
      const purgedTitle = f.title.replace(/[^a-zA-Z0-9]/g, " ");
      const fileTitle = path.join(DESTINATION_DIR, purgedTitle + ".md");
      fs.writeFileSync(fileTitle, fileData);
      console.log("Did Write @", purgedTitle);
    }
  }

  process.exit(0);
}

run();
