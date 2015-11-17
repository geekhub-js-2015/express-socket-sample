'use strict';

const gulp = require('gulp'),
    jshint = require('gulp-jshint'),
    jshintStylish = require('jshint-stylish');

gulp.task('default', ['scripts:hint']);

gulp.task('scripts:hint', () => {
    return gulp.src('server/**/*.js')
        .pipe(jshint({esnext: true}))
        .pipe(jshint.reporter(jshintStylish));
});

gulp.task('watch', ['scripts:hint'], () => {
    gulp.watch('server/**/*.js', ['scripts:hint']);
});
