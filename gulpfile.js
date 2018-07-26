var gulp = require("gulp");
var sass = require("gulp-sass");
var autoprefixer = require("gulp-autoprefixer");
var browserSync = require("browser-sync").create();
var eslint = require("gulp-eslint");

const watching = () => {
  gulp.watch("sass/**/*.scss", ["sass"]);
};

gulp.task("watch", gulp.series(gulp.parallel("browserSync", "sass"), watching));

gulp.task("sass", () => {
  return gulp
    .src("sass/**/*.scss")
    .pipe(
      sass({
        outputStyle: "compressed"
      }).on("error", sass.logError)
    )
    .pipe(
      autoprefixer({
        browsers: ["last 2 versions"]
      })
    )
    .pipe(gulp.dest("./css"))
    .pipe(browserSync.reload({ stream: true }));
});

gulp.task("copy-html", () => {
  gulp.src("./index.html").pipe(gulp.dest("./dist"));
});

gulp.task("copy-images", () => {
  gulp.src("img/*").pipe(gulp.dest("dist/img"));
});
