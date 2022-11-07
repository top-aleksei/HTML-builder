const fs = require("fs");
const fsPromises = require("fs/promises");
const path = require("path");

const bundlePath = path.join(__dirname, "project-dist");

const copyFromFolderPath = path.join(__dirname, "assets");
const copyToFolderPath = path.join(__dirname, "project-dist", "assets");

const cssFromFolderPath = path.join(__dirname, "styles");
const cssToFilePath = path.join(__dirname, "project-dist", "style.css");

async function buildHTML() {
  await fsPromises.rm(bundlePath, { recursive: true, force: true });

  await makeCopy(copyToFolderPath, copyFromFolderPath);
  chooseCSS();
  readHTMl();
}

async function makeCopy(toPath, fromPath) {
  await fsPromises.mkdir(toPath, { recursive: true });
  let files = await fsPromises.readdir(fromPath, { withFileTypes: true });
  files.forEach((file) => copyFiles(file, toPath, fromPath));
}

async function copyFiles(file, toPath, fromPath) {
  const fromFilePath = path.join(fromPath, file.name);
  const toFilePath = path.join(toPath, file.name);
  let fileType = await (await fsPromises.stat(fromFilePath)).isFile();
  if (!fileType) {
    makeCopy(toFilePath, fromFilePath);
  } else {
    await fsPromises.copyFile(fromFilePath, toFilePath);
  }
}

async function chooseCSS() {
  let files = await fsPromises.readdir(cssFromFolderPath, {
    withFileTypes: true,
  });
  files.forEach((file) => mergeFiles(file));
}

function mergeFiles(file) {
  const fromFilePath = path.join(cssFromFolderPath, file.name);
  const fileExt = path.extname(fromFilePath);
  if (fileExt != ".css") {
    return;
  }
  //   console.log(file.name);
  const input = fs.createReadStream(fromFilePath, "utf8");
  const output = fs.createWriteStream(cssToFilePath, { flags: "a" });

  input.pipe(output);
}

function readHTMl() {
  const input = fs.createReadStream(
    path.join(__dirname, "template.html"),
    "utf8"
  );
  const output = fs.createWriteStream(path.join(bundlePath, "index.html"));
  input.on("data", (chunk) => switchHTML(chunk, output));
}

async function switchHTML(data, output) {
  while (data.indexOf("{{") != -1) {
    let tag = data.slice(data.indexOf("{"), data.indexOf("}") + 2);
    let name = tag.replace("{{", "").replace("}}", "");
    let componentPath = path.join(__dirname, "components", `${name}.html`);
    try {
      let newTag = await fsPromises.readFile(componentPath);
      data = data.replace(tag, newTag.toString());
    } catch {
      console.log("No such component");
    }
  }
  output.write(data);
}

buildHTML();
