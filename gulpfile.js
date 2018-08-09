const gulp = require("gulp");
const gutil = require("gulp-util");
const autoprefixer = require("gulp-autoprefixer");
const cleanCSS = require("gulp-clean-css");
const uglify = require("gulp-uglify-es").default;
const sass = require("gulp-sass");
const concat = require("gulp-concat");
const babel = require("gulp-babel");
const sourcemap = require("gulp-sourcemaps");
const imageminPngquant = require("imagemin-pngquant");
const imagemin = require("gulp-imagemin");
const browserSync = require("browser-sync").create();
const styleSRC = {
  dir: "sass/*.scss",
  dist: "dist/css"
};

const javascriptSRC = {
  dirForIndexPage: ["js/dbhelper.js", "js/main.js"],
  dirForRestaurantPage: [
    "js/dbhelper.js",
    "js/restaurant_info.js",
    "js/main.js"
  ],
  dist: "dist/js"
};
// --------------------------------------------- Sass 2 CSS & minify
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
    .pipe(gulp.dest(styleSRC.dist))
    .pipe(browserSync.stream());
});
// --------------------------------------------- Minify JS and concact for files necessary on INDEX
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

// --------------------------------------------- Minify JS and concact for files necessary on Restaurant
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

// --------------------------------------------- Optimize Images
gulp.task("imageOpt", () => {
  return gulp
    .src("img/*")
    .pipe(
      imagemin({
        progressive: true,
        optimizationLevel: 5,
        use: [imageminPngquant()]
      })
    )
    .pipe(gulp.dest("dist/img"));
});

// --------------------------------------------- Default
gulp.task(
  "default",
  gulp.parallel(
    "minify:sass2css",
    "minifyjs:index",
    "minifyjs:restaurant",
    "imageOpt"
  )
);

// --------------------------------------------- Serve

// gulp.task("serve", ["minify:sass2css"], function() {
//   browserSync.init({
//     server: "./",
//     browser: "google chrome"
//   });

//   gulp.watch(styleSRC.dir, gulp.series("minify:sass2css"));
//   gulp.watch(javascriptSRC.dirForIndexPage, gulp.series("minifyjs:index"));
//   gulp.watch(
//     javascriptSRC.dirForRestaurantPage,
//     gulp.series("minifyjs:restaurant")
//   );
// });

// --------------------------------------------- Watch these files for changes/updates
gulp.task("watch", () => {
  gulp.watch(styleSRC.dir, gulp.series("minify:sass2css"));
  gulp.watch(javascriptSRC.dirForIndexPage, gulp.series("minifyjs:index"));
  gulp.watch(
    javascriptSRC.dirForRestaurantPage,
    gulp.series("minifyjs:restaurant")
  );
});
