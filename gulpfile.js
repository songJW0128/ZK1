/*
 * @Author: sjw 
 * @Date: 2019-01-02 09:03:33 
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2019-01-02 10:03:26
 */

var gulp = require('gulp');
var sass = require('gulp-sass');
var clean = require('gulp-clean-css');
var uglify = require('gulp-uglify');
var webserver = require('gulp-webserver');
var concat = require('gulp-concat');
var url = require('url');
var path = require('path');
var fs = require('fs');


gulp.task('sass', function() {
    return gulp.src('./src/scss/**/*.scss')
        .pipe(sass())
        .pipe(gulp.dest('./src/css'))
})

gulp.task('watch', function() {
    return gulp.watch('./src/scss/*.scss', gulp.series('sass'))
})

gulp.task('webserver', function() {
    return gulp.src('src')
        .pipe(webserver({
            port: 8888,
            open: true,
            livereload: true,
            middleware: function(req, res, next) {
                var pathname = url.parse(req.url).pathname;
                if (pathname === '/favicon.ico') {
                    return res.end('')
                }
                if (pathname === 'api/list') {
                    res.end(JSON.stringify({ code: 0, data: list }))
                } else {
                    pathname = pathname === '/' ? 'index.html' : pathname;
                    res.end(fs.readFileSync(path.join(__dirname, 'src', pathname)))
                }
            }
        }))
})


gulp.task('Copycss', function() {
    return gulp.src('./src/scss/*.scss')
        .pipe(sass())
        .pipe(clean())
        .pipe(gulp.dest('./bulid/css'))
})
gulp.task('uglify', function() {
    return gulp.src('./src/js/*.js')
        .pipe(uglify())
        .pipe(concat())
        .pipe(gulp.dest('./bulid/js'))
})


gulp.task('dev', gulp.series('sass', 'watch', 'webserver', 'Copycss', 'uglify'))