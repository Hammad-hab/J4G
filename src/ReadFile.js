const pl = require("./parse-and-evaluate");
const fs = require("fs");
const readline = require("readline");
const { exit } = require("process");
const { error } = require("./Message");
const { default: chalk } = require("chalk");
const colors = require("colors/safe");
const prompt = require("prompt-sync")();
var lineNo = 1;
function createreadStream(src, functionCall, onClose) {
  var ReadStream = readline.createInterface({
    input: fs.createReadStream(src.trim()),
    output: process.stdout,
    terminal: false,
  });
  ReadStream.on("line", (line) => {
    functionCall(line);
  });

  ReadStream.on("close", () => {
    if (typeof onClose === "function") {
      onClose();
    }
  });
}
function prompter() {

  var file = prompt(chalk.blue("=> Enter file URL "));
  var filename = prompt(chalk.blue("=> File name  "));
  if (!file || !filename) {
    error(`File URL OR File name not provided`);
    prompter();
  } else if (file === "--" || filename === "--") {
    exit();
  } else if (file === "setDefFile") {
    file = prompt(chalk.blue("=> Enter default file URL "));
    fs.writeFile(
      file,
      "Default file is set.\n " + filename + "\n" + file,
      () => {},
      () => {}
    );
  }
  else {
    return {
      file,
      filename,
    };
  }
}
var content = ``;
const editor = () => {
  try {
    console.log("Entering File Reader");
    var returned = prompter();
    var file = returned.file;
    createreadStream(
      file.trim(),
      (line) => {
        if (!line.startsWith('//')) {
         line.replaceAll("\n", "");
        if (line.indexOf("//") > 0 && !line.startsWith("//")) {
          line = line.substring(0, line.indexOf('//'))
        }
        if (line.indexOf(";") > 0) {
          content += line + "\n";
        } else {
          content += line;
        }
      }
      },
      () => {
        var filename = returned.filename;
        try {
          fs.writeFile(
            "/Users/hammad/Documents/htdocs/Hammad-Subhtdocs/NewScript/compiled/" +
              filename +
              "-compiled",
            content,
            () => {},
            () => {}
          );
        } catch (error) {
          fs.appendFile(
            "/Users/hammad/Documents/htdocs/Hammad-Subhtdocs/NewScript/compiled/" +
              filename +
              "-compiled",
            content
          );
        }
        var newURL =
          "/Users/hammad/Documents/htdocs/Hammad-Subhtdocs/NewScript/compiled/" +
          filename +
          "-compiled";
        console.clear();
        console.log(colors.zebra(`====START====`));
        createreadStream(
          newURL,
          (line) => {
            if (!line.startsWith('//')) {
            pl.eval(line);
            } 
            lineNo++
          },
          () => {}
        );
      }
    );
  } catch (err) {
    error(err);
  }
};

module.exports = {
  editor,
};

/*  
  if (line[0] === "/" && line[1] === "/") lineNo++
    else if (line) {
    parseAndEvaluate(line);
    lineNo++
    }
cle
*/