const gulp = require("gulp");
const gutil = require("gulp-util");
const autoprefixer = require("gulp-autoprefixer");
const cleanCSS = require("gulp-clean-css");
const uglify = require("gulp-uglify-es").default;
const sass = require("gulp-sass");
const concat = require("gulp-concat");

const styleSRC = {
  dir: "sass/*.scss",
  dist: "dist/css"
};

const javascriptSRC = {
  dirForIndexPage: ["js/dbhelper.js", "js/main.js"],
  dirForRestaurantPage: ["js/dbhelper.js", "js/restaurant_info.js"],
  dist: "dist/js"
};

gulp.task("minify:sass2css", function() {
  return gulp
    .src(styleSRC.dir)
    .pipe(sass().on("error", sass.logError))
    .pipe(
      autoprefixer({
        browsers: ["last 2 versions"],
        cascade: false
      })
    )
    .pipe(cleanCSS({ compatibility: "ie8" }))
    .pipe(gulp.dest(styleSRC.dist));
});

gulp.task("minifyjs:index", () => {
  return gulp
    .src(javascriptSRC.dirForIndexPage)
    .pipe(uglify())
    .pipe(concat("index.min.js"))
    .on("error", function(err) {
      gutil.log(gutil.colors.red("[Error]"), err.toString());
    })
    .pipe(gulp.dest(javascriptSRC.dist));
});

gulp.task("minifyjs:restaurant", () => {
  return gulp
    .src(javascriptSRC.dirForRestaurantPage)
    .pipe(uglify())
    .pipe(concat("restaurant.min.js"))
    .on("error", function(err) {
      gutil.log(gutil.colors.red("[Error]"), err.toString());
    })
    .pipe(gulp.dest(javascriptSRC.dist));
});

gulp.task("default", [
  "minify:sass2css",
  "minifyjs:index",
  "minifyjs:restaurant"
]);
