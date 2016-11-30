const gulp = require('gulp');
const rename = require('gulp-rename');
const uglify = require('gulp-uglify');
const babelify = require('babelify');
const browserify = require('browserify');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const sourcemaps = require('gulp-sourcemaps');

const getBundle = () => {
  return browserify({
    entries: [`${global.gulpConfig.src}/shim.js`]
  })
  .transform(babelify.configure({presets: ['es2015']}))
  .bundle();
};

gulp.task('build:unminified', () => {
  return getBundle()
  .pipe(source('shim.js'))
  .pipe(gulp.dest(`${global.gulpConfig.dest}`));
});

gulp.task('build:minified', () => {
  return getBundle()
  .pipe(source('shim.js'))
  .pipe(buffer())
  .pipe(sourcemaps.init({loadMaps: true}))
  .pipe(uglify())
  .pipe(rename({extname: '.min.js'}))
  .pipe(sourcemaps.write('./'))
  .pipe(gulp.dest(`${global.gulpConfig.dest}`));
});

gulp.task('build', ['build:unminified', 'build:minified']);
