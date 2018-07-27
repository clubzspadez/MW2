const gulp = require("gulp");
const gutil = require("gulp-util");
const autoprefixer = require("gulp-autoprefixer");
const cleanCSS = require("gulp-clean-css");
const uglify = require("gulp-uglify-es").default;
const sass = require("gulp-sass");
const concat = require("gulp-concat");

gulp.task("sass", function() {
  return gulp
    .src("sass/*.scss")
    .pipe(sass().on("error", sass.logError))
    .pipe(
      autoprefixer({
        browsers: ["last 2 versions"],
        cascade: false
      })
    )
    .pipe(cleanCSS({ compatibility: "ie8" }))
    .pipe(gulp.dest("dist/css"));
});

gulp.task("minify:index", function() {
  return gulp
    .src(["js/dbhelper.js", "js/main.js"])
    .pipe(uglify())
    .pipe(concat("all.min.js"))
    .on("error", function(err) {
      gutil.log(gutil.colors.red("[Error]"), err.toString());
    })
    .pipe(gulp.dest("dist/js"));
});
