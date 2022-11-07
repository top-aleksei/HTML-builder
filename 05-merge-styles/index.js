const fs = require("fs");
const path = require("path");

const fromFolderPath = path.join(__dirname, "styles");
const toFolderPath = path.join(__dirname, "project-dist");
const toFilePath = path.join(toFolderPath, "bundle.css");

fs.truncate(toFilePath, (err) => {
  if (err) {
    return;
  }
});
fs.promises.readdir(fromFolderPath, { withFileTypes: true }).then((files) => {
  files.forEach((file) => mergeFiles(file));
});

function mergeFiles(file) {
  const fromFilePath = path.join(fromFolderPath, file.name);
  const fileExt = path.extname(fromFilePath);
  if (fileExt != ".css") {
    return;
  }
  console.log(file.name);
  const input = fs.createReadStream(fromFilePath, "utf8");
  const output = fs.createWriteStream(toFilePath, { flags: "a" });

  input.pipe(output);
}
