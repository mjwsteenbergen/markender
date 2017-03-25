var remarkable = require('markdown-it');
var path = require('path');
var replaceStream = require('replacestream');
var fs = require('fs');
var express = require('express');
var http = require('http');
var app = express();
var runningWebsite = false;
var componentsPlugin = require('./components-plugin'); 
var watch = require('watch');
var reload = require('reload');
var mkatex = require('./formula-plugin')

var markdown;
var opts;

function markender(options) {
    opts = options;
    ConvertMDtoHTML(opts.file, (markdown) => {
        RenderHTML(markdown, () => {
            SetUpWebserver();
        });
    });
}

function ConvertMDtoHTML(file, done)
{
    fs.readFile(file, function (err, data) {
        if (err) {
            throw err; 
        }
        var md = new remarkable({
            html: true
        });
        // md.inline.ruler.enable([
        // 'sub',
        // 'sup'
        // ]);
        // md.use(componentsPlugin);
        md.use(mkatex);
        md.use(require('markdown-it-enml-todo'))
        markdown = data.toString();
        done(md.render(markdown));
    });
}

function RenderHTML(html, done) {
    var stream = fs.createReadStream(path.join(__dirname, "src/template.html"))
    .pipe(replaceStream('{{content}}', html))
    .pipe(replaceStream('{{css}}', opts.css))
    .pipe(fs.createWriteStream(path.join(__dirname, "src/index.html")));

    stream.on('finish', function(){
        done();
        console.log("The file was saved!");            
    });
}


function SetUpWebserver() {
    if(runningWebsite) {
        return;
    }
    runningWebsite = true;

    app.use(express.static(__dirname + '/src'))

    app.get('/', function (req, res, next) {
        try {
            res.sendFile(__dirname + '/src/index.html');
        } catch (e) {
            next(e)
        }
    })


    var server = http.createServer(app)
    var reloadServer = reload(server, app);

    watch.watchTree(__dirname + "/src", function (f, curr, prev) {
        if(f.toString().includes("index.html"))
        {
            return;
        }
        watchReload(reloadServer)
        // Fire server-side reload event 
    });

    fs.watchFile(opts.file, (curr,prev) => {
        watchReload(reloadServer);
    })

    server.listen(process.env.PORT || 3000, function () {
        console.log('Listening on http://localhost:' + (process.env.PORT || 3000))
    })
    
}

function watchReload(reloadServer) {
    ConvertMDtoHTML(opts.file, (markdown) => {
        var once = false;
        RenderHTML(markdown, () => {
            if(once)
            {
                return;
            }
            once = true;
            reloadServer.reload();        
        });
    });
}

module.exports = markender;


