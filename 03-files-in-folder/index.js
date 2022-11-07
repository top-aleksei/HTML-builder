const fs = require("fs/promises");
const path = require("path");

const myPath = path.join(__dirname, "secret-folder");

fs.readdir(myPath, { withFileTypes: true }).then((files) => {
  files.forEach((file) => showFile(file));
});

function showFile(file) {
  if (file.isFile()) {
    const filePath = path.join(myPath, file.name);
    const fileExt = path.extname(filePath).slice(1);
    const fileName = path.basename(filePath).split(".")[0];
    let fileSize;
    fs.stat(filePath).then((res) => {
      fileSize = res.size / 1000 + "kb";
      let result = [fileName, fileExt, fileSize];
      console.log(result.join(" - "));
    });
  }
}
