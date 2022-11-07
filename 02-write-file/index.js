const { stdin, stdout, exit } = process;
const fs = require("fs");
const path = require("path");

const myPath = path.join(__dirname, "text.txt");

fs.writeFile(myPath, "", (err) => {
  if (err) {
    console.log(err);
  }
});

stdout.write("Type in text you want to save in text.txt\n");
stdin.on("data", (data) => {
  editTxt(data);
});

function editTxt(data) {
  if (data.toString().trim() === "exit") {
    sayBye();
  }
  fs.appendFile(myPath, data.toString().replace("\r\n", ""), (err) => {
    if (err) {
      console.log(err);
    }
  });
}

function sayBye() {
  stdout.write("Bye, have a nice day!");
  exit();
}

process.on("SIGINT", sayBye);
