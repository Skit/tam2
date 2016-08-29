/**
 * Created by Micro on 29.08.2016.
 */
var gulp    = require('gulp'),
    uglify  = require('gulp-uglify'),
    concat  = require('gulp-concat'),
    mcss    = require('gulp-minify-css'),
    jshint  = require('gulp-jshint');

gulp.task('js', function() {

    return gulp.src(['public/javascripts/**/*.js', '!public/javascripts/**/jquery*'])
        .pipe(jshint())
        .pipe(jshint.reporter('default'))
        .pipe(uglify())
        .pipe(concat('app.min.js'))
        .pipe(gulp.dest('public/assets'));
});

gulp.task('css', function() {

    return gulp.src(['public/stylesheets/**/*.css', '!public/stylesheets/**/*min.css'])
        .pipe(mcss())
        .pipe(concat('app.min.css'))
        .pipe(gulp.dest('public/assets'));
});