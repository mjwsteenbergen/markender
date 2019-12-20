var fs = require('fs');
var glob = require("glob");



fs.writeFileSync("./README.md", fs.readFileSync("docs/README.base.md"));

glob("components/src/components/**/readme.md", {}, function (er, files) {
  files.forEach((someFile) => {
    var data = fs.readFileSync(someFile, 'utf8');

    if (data.includes("<!-- EXCLUDE IN README -->")) {
      return;
    }

    var result = data.replace(/## Dependencies(?:.|\n)+/g, '');
    var result = result.replace(/\*Built with \[StencilJS\]\(https:\/\/stenciljs.com\/\)\*/g, '');
    var result = result.replace(/^### /g, '#### ');
    var result = result.replace(/^## /g, '### ');
    var result = result.replace(/^# /g, '## ');

    fs.appendFileSync("./README.md", result, 'utf8', function (err) {
      if (err) return console.log(err);
    });
  })

  fs.appendFileSync("./README.md", fs.readFileSync("docs/README.appendix.md"), 'utf8', function (err) {
    if (err) return console.log(err);
  });
  fs.appendFileSync("./README.md", fs.readFileSync("CHANGELOG.md"), 'utf8', function (err) {
    if (err) return console.log(err);
  });
})





