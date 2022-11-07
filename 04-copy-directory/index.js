const fs = require("fs/promises");
const path = require("path");

const fromFolderPath = path.join(__dirname, "files");
const toFolderPath = path.join(__dirname, "files-copy");

async function makeCopy() {
  await fs.rm(toFolderPath, { recursive: true, force: true });
  await fs.mkdir(toFolderPath, { recursive: true });
  let files = await fs.readdir(fromFolderPath, { withFileTypes: true });
  files.forEach((file) => copyFiles(file));
}

async function copyFiles(file) {
  const fromFilePath = path.join(fromFolderPath, file.name);
  const toFilePath = path.join(toFolderPath, file.name);
  await fs.copyFile(fromFilePath, toFilePath);
}

makeCopy();
