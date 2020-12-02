// Declaration of constants for GULP plugins
const { src, dest, watch, series, parallel } = require('gulp'),
  pug = require('gulp-pug'),
  htmlmin = require('gulp-htmlmin'),
  sass = require('gulp-sass'),
  sourcemaps = require('gulp-sourcemaps'),
  notify = require('gulp-notify'),
  autoprefixer = require('gulp-autoprefixer'),
  cleanCSS = require('gulp-clean-css'),
  concat = require('gulp-concat'),
  rename = require('gulp-rename'),
  babel = require('gulp-babel'),
  uglify = require('gulp-uglify'),
  del = require('del'),
  imagemin = require('gulp-imagemin'),
  browserSync = require('browser-sync').create();

// Path declaration
const path = {
  source: './src',
  project: './build',
};

// Сompilation Pug to HTML
const pugToHTML = cb => {
  src(`${path.source}/pug/*.pug`)
    .pipe(pug({ pretty: true }))
    .pipe(dest(`${path.source}`));
  cb();
};

// Сompilation Sass to CSS & compressing CSS files
const sassToCSS = cb => {
  src(`${path.source}/sass/*.{scss,sass}`)
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', notify.onError()))
    .pipe(autoprefixer({ overrideBrowserslist: ['last 10 versions'] }))
    .pipe(dest(`${path.source}/css`))
    .pipe(cleanCSS())
    .pipe(rename({ suffix: '.min' }))
    .pipe(sourcemaps.write('.'))
    .pipe(dest(`${path.source}/css`));
  cb();
};

// Combining, compiling and compressing JS files
const script = cb => {
  src(`${path.source}/js/modules/*.js`)
    .pipe(sourcemaps.init())
    .pipe(concat('main.js'))
    .pipe(dest(`${path.source}/js`))
    .pipe(babel())
    .pipe(uglify())
    .pipe(rename({ suffix: '.min' }))
    .pipe(sourcemaps.write('.'))
    .pipe(dest(`${path.source}/js`));
  cb();
};

// Server start & watch Pug, Sass, JS files
const server = () => {
  browserSync.init({
    server: {
      baseDir: `${path.source}`,
    },
    notify: false,
  });

  watch(`${path.source}/pug/**/*.pug`, pugToHTML).on('change', browserSync.reload);
  watch(`${path.source}/sass/**/*.{sass,scss}`, sassToCSS).on('change', browserSync.reload);
  watch(`${path.source}/js/modules/*.js`, script).on('change', browserSync.reload);
};

// Delete folder
const deleteFolder = () => del(`${path.project}/`);

// Compress and moving HTML files
const buildHTML = cb => {
  src(`${path.source}/*.html`)
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(dest(`${path.project}`));
  cb();
};

// Moving compressed CSS files
const buildCSS = cb => {
  src(`${path.source}/css/*.min.css`)
    .pipe(dest(`${path.project}/css`));
  cb();
};

// Moving compressed JS files
const buildJS = cb => {
  src(`${path.source}/js/*.min.js`)
    .pipe(dest(`${path.project}/js`));
  cb();
};

// Moving PHP files
const buildPHP = cb => {
  src(`${path.source}/php/**/*.php`)
    .pipe(dest(`${path.project}/php`));
  cb();
};

// Moving fonts
const buildFonts = cb => {
  src(`${path.source}/fonts/**/*`)
    .pipe(dest(`${path.project}/fonts`));
  cb();
};

// Compress and moving images
const buildImages = cb => {
  src(`${path.source}/images/**/*`)
    .pipe(imagemin([
      imagemin.gifsicle({ interlaced: true }),
      imagemin.mozjpeg({ quality: 75, progressive: true }),
      imagemin.optipng({ optimizationLevel: 5 }),
      imagemin.svgo({
        plugins: [
          { removeViewBox: true },
          { cleanupIDs: false }
        ]
      })
    ]))
    .pipe(dest(`${path.project}/images`));
  cb();
};

// Export tasks
exports.start = series(parallel(pugToHTML, sassToCSS, script), server);
exports.build = series(parallel(pugToHTML, sassToCSS, script), deleteFolder,
  parallel(buildHTML, buildCSS, buildJS, buildPHP, buildFonts, buildImages));
