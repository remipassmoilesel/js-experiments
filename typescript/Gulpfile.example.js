var gulp = require('gulp'),
    watch = require('gulp-watch'),
    ts = require("gulp-typescript"),
    tslint = require('gulp-tslint');

var tsFiles = ['src/**/*.ts'];
var filesToWatch = [].concat(tsFiles);
var distDir = "dist/";
var tsOutputFileName = "output.js";

console.log();
console.log('TS sources: ' + tsFiles);
console.log('Watching files: ' + filesToWatch);
console.log('Destination directory: ' + distDir);
console.log();

// lint typescript files
gulp.task('tslint', function () {

    console.log();
    console.log();
    console.log("Starting lint: ");

        gulp.src(tsFiles)
            .pipe(tslint({
                formatter: 'prose'
            }))
            .pipe(tslint.report())
            .on('error', function (error) {
                console.log("** tslint: Errors happened");
                //console.log("Errors: " + error['message']);
            });
    }
);

// compile typescript files
gulp.task('tsc', function () {
        gulp.src(tsFiles)
            .pipe(ts({
                outFile: tsOutputFileName,
                noImplicitAny: true,
                target: "ES5",
                pretty: true,
            }))
            .pipe(gulp.dest(distDir));
    }
);

// watch files
gulp.task('watch', function () {
    gulp.watch(filesToWatch, ['tslint', 'tsc']);
});

gulp.task('default', ['tslint', 'tsc', 'watch']);

