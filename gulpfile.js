const gulp = require("gulp");
const gutil = require("gulp-util");
const autoprefixer = require("gulp-autoprefixer");
const cleanCSS = require("gulp-clean-css");
const uglify = require("gulp-uglify-es").default;
const sass = require("gulp-sass");
const concat = require("gulp-concat");
const babel = require("gulp-babel");
const sourcemap = require("gulp-sourcemaps");

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
    .pipe(sourcemap.init())
    .pipe(babel())
    .pipe(uglify())
    .pipe(concat("index.min.js"))
    .pipe(sourcemap.write())
    .on("error", function(err) {
      gutil.log(gutil.colors.red("[Error]"), err.toString());
    })
    .pipe(gulp.dest(javascriptSRC.dist));
});

gulp.task("minifyjs:restaurant", () => {
  return gulp
    .src(javascriptSRC.dirForRestaurantPage)
    .pipe(sourcemap.init())
    .pipe(babel())
    .pipe(uglify())
    .pipe(concat("restaurant.min.js"))
    .pipe(sourcemap.write())
    .on("error", function(err) {
      gutil.log(gutil.colors.red("[Error]"), err.toString());
    })
    .pipe(gulp.dest(javascriptSRC.dist));
});

gulp.task(
  "default",
  gulp.parallel("minify:sass2css", "minifyjs:index", "minifyjs:restaurant")
);

gulp.task("watch", () => {
  gulp.watch(styleSRC.dir, gulp.series("minify:sass2css"));
  gulp.watch(javascriptSRC.dirForIndexPage, gulp.series("minifyjs:index"));
  gulp.watch(
    javascriptSRC.dirForRestaurantPage,
    gulp.series("minifyjs:restaurant")
  );
});
