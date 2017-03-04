var Remarkable = require('remarkable');
var path = require('path');
var replaceStream = require('replacestream');
var fs = require('fs');
var ncp = require('ncp').ncp;
var express = require('express');
var http = require('http');
var app = express();
var runningWebsite = false;
var componentsPlugin = require('./components-plugin'); 
var watch = require('watch');

var markdown;

ConvertMDtoHTML((markdown) => {
    RenderHTML(markdown, () => {
        SetUpWebserver();
    });
});

function ConvertMDtoHTML(done)
{
    fs.readFile('./file.md', function (err, data) {
        if (err) {
            throw err; 
        }
        var md = new Remarkable({
            html: true
        });
        md.use(componentsPlugin);
        markdown = data.toString();
        done(md.render(markdown));
    });
}

function RenderHTML(html, done) {
    
    var source = path.join(__dirname, "/template/");
    var destination = path.join(__dirname, "/build/");

    ncp(source, destination, function (err) {
        if (err) {
            return console.error(err);
        }

        var stream = fs.createReadStream(path.join(__dirname, "/build/template.html"))
        .pipe(replaceStream('{{content}}', html))
        .pipe(fs.createWriteStream(path.join(__dirname, "/build/index.html")));

        stream.on('finish', function(){
            done();
            console.log("The file was saved!");            
        });
    });

    

}


function SetUpWebserver() {
    if(runningWebsite) {
        return;
    }
    runningWebsite = true;

    app.use(express.static(__dirname + '/build'))

    app.get('/', function (req, res, next) {
        try {
            res.sendFile(__dirname + '/build/index.html');
        } catch (e) {
            next(e)
        }
    })

    var reload = require('reload')

    var server = http.createServer(app)
    var reloadServer = reload(server, app);

    watch.watchTree(__dirname + "/template", function (f, curr, prev) {
        console.log("Files changed. Reloading");
        ConvertMDtoHTML((markdown) => {
            RenderHTML(markdown, () => {
                reloadServer.reload();        
            });
        });
        // Fire server-side reload event 
    });

    server.listen(process.env.PORT || 3000, function () {
        console.log('Listening on http://localhost:' + (process.env.PORT || 3000))
    })
    
}


