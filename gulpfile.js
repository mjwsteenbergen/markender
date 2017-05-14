//Gulp
var gulp = require("gulp");
var ts = require("gulp-typescript");
var replace = require('gulp-replace');
var clean = require('gulp-clean');
var rename = require('gulp-rename');
var argv = require('yargs').argv;
var fs = require("fs");
var server = require('gulp-express');

//Markdown
var MdIt = require('markdown-it');
var mkatex = require('./formula-plugin')

var program = require('commander')
const path = require('path');
var argv = require('yargs').alias('l', 'location').argv;
var webpack = require("webpack-stream");



var paths = {
    ts: ["html/**/*.ts"],
    html: ["html/**/.html"],
}

var tsProject = ts.createProject('tsconfig.json');

gulp.task("default", ["document", "html", "css", "watch", "webpack"], function() {
    server.run(["server.js"]);
    gulp.watch("./**/*", server.notify);
});

gulp.task("typescript", function() {
    return tsProject.src()
        .pipe(tsProject())
        .js.pipe(gulp.dest("dist/script/"));
})

var renderedMarkdown = "SomethingWentWrong while rendering the markdown";
gulp.task("render-markdown", function (done) {
    fs.readFile(argv.location, function (err, data) {
        if (err) {
            throw err; 
        }
        var md = new MdIt({
            html: true,
            typographer:  false
        });
        md.use(mkatex);
        md.use(require('markdown-it-enml-todo'))
        var markdown = data.toString();
        renderedMarkdown = md.render(markdown);
        done();
    });
});

gulp.task("document", ["render-markdown"], function () {    
    return gulp.src('src/template.html')
    .pipe(replace("{{content}}", renderedMarkdown))
    .pipe(replace("{{css}}", "latex"))
    .pipe(rename("index.html"))
    .pipe(gulp.dest('dist/'));
});

gulp.task("html", function () {
    return gulp.src('src/html/*.html')
    .pipe(gulp.dest('dist/html/'));
});

gulp.task("css", function () {
    return gulp.src('src/css/**/*.*')
    .pipe(gulp.dest('dist/css/'));
});

gulp.task("clean", function () {
    return gulp.src('dist/', {read: false})
        .pipe(clean());
});

gulp.task("watch", function () {
    gulp.watch(paths.html, ['copy-html']);
    gulp.watch(argv.file, ['document']);
});

gulp.task("webpack", ["typescript"], function () {
    return gulp.src('dist/script/md-bib.js')
    .pipe(webpack({
         output: {
            path: path.resolve(__dirname, 'dist'),
            filename: 'output.bundle.js'
        },
    }))
    .pipe(gulp.dest('dist/'));
});