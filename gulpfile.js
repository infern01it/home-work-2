var path           = require('path'),
	gulp           = require('gulp'),
	browserSync    = require('browser-sync'),
	notify         = require("gulp-notify"),
	cache          = require('gulp-cache'),
	autoprefixer   = require('gulp-autoprefixer'),
	imagemin       = require('gulp-imagemin'),
	sass           = require('gulp-sass'),
	cssbeautify    = require('gulp-cssbeautify'),
	snippets       = require('sass-snippets');

// Browser Synk
gulp.task('browser-sync', function() {
	browserSync({ server: true, notify: false });
});

// Слежение за JS
gulp.task('js', function() {
	return gulp.src('js/**/*.js')
		.pipe(browserSync.reload({stream: true}));
});

// SASS Компиляция
gulp.task('sass', function() {
	return gulp.src(['sass/**/*.+(sass|scss)','!sass/bootstrap/**/*.+(sass|scss)'])
		.pipe(sass({
        	includePaths: snippets.includePaths
    	}).on("error", notify.onError()))
		.pipe(autoprefixer(['last 15 versions']))
		.pipe(cssbeautify({indent: '	'}))
		.pipe(gulp.dest('css'))
		.pipe(browserSync.reload({stream: true}));
});

gulp.task('watch', ['sass', 'js', 'browser-sync'], function() {
	gulp.watch('sass/**/*.+(sass|scss)', ['sass']);
	gulp.watch('js/**/*.js', browserSync.reload);
	gulp.watch('**/*.html', browserSync.reload);
});

gulp.task('imagemin', function() {
	return gulp.src(['img/**/*','content/**/*'])
		.pipe(cache(imagemin())) // Cache Images
		.pipe(gulp.dest('img-min'));
});

gulp.task('default', ['watch']);