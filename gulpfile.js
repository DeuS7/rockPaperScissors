// Initialize modules
const { src, dest, watch, series, parallel } = require("gulp");
const concat = require("gulp-concat");
const replace = require("gulp-replace");
const sass = require("gulp-sass");
const sourcemaps = require("gulp-sourcemaps");
const uglify = require("gulp-uglify");
const browsersync = require("browser-sync").create();
const autoprefixer = require('gulp-autoprefixer');

//BrowserSync
function browserSync(done) {
	browsersync.init({
		server: {
			baseDir: "app"
		},
		port: 3000
	});
	done();
}

// BrowserSync Reload
function browserSyncReload(done) {
	browsersync.reload();
	done();
}


// File path vars
const files = {
	scssPath: 'app/scss/**/*.scss',
	jsPath: 'app/jsNext/**/*.js',
	htmlPath: 'app/*.html'
}

//////////////////// Development Tasks ///////////////////

function devCss() {
	return src(files.scssPath)
		.pipe(sass())
		.pipe(sourcemaps.write('.'))
		.pipe(dest('app/css'))
    	.pipe(browsersync.stream());
}

function devJs() {
	return src(files.jsPath)
		.pipe(dest('app/js'))
		.pipe(browsersync.stream());
}

///////////////////// Dist tasks /////////////////////////

function distJs() {
	return src(files.jsPath)
		//.pipe(concat('build.js'))
		//.pipe(uglify())
		.pipe(dest('dist/js'));
}

function distCss() {
	return src(files.scssPath)
		.pipe(sourcemaps.init())
		.pipe(sass())
		.pipe(autoprefixer({
			browsers: ['last 2 version', '> 0.25%'],
			cascade: true,
			remove: true
		}))
		.pipe(sourcemaps.write('.'))
		.pipe(dest('dist/css'));
}

function htmlBuildTask() {
	return src(files.htmlPath)
		.pipe(dest('dist'));
}

////////////////////////////////////////////////////////////


// Watch task
function watchFiles() {
	watch("app/scss/**/*.{scss,sass}", devCss);
	watch("app/jsNext/**/*.js", devJs);
	watch("app/*.html", browserSyncReload);
}

// Exports
exports.wa = parallel(watchFiles, browserSync);

exports.distJs = distJs;
exports.devJs = devJs;

exports.htmlBuildTask = htmlBuildTask;

exports.distCss = distCss;
exports.devCss = devCss;
