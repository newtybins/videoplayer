const gulp = require('gulp');
const path = require('path');
const rimraf = require('rimraf');
const typescript = require('gulp-typescript');
const uglify = require('gulp-uglify');

// Clean the old build directory
gulp.task('clean', () => {
    return new Promise((resolve, reject) => {
        rimraf(path.join(__dirname, 'dist'), e => (e ? reject(e) : resolve()));
    });
});

// Build the typescript files
gulp.task('build:ts', () => {
    const tsc = typescript.createProject('tsconfig.json');

    return gulp
        .src('src/**/*.ts')
        .pipe(tsc())
        .pipe(uglify({ mangle: { toplevel: true } }))
        .pipe(gulp.dest('dist'));
});

gulp.task('build', gulp.series('clean', 'build:ts'));
