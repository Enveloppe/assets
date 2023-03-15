const gulp = require('gulp');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const cleanCSS = require('gulp-clean-css');
gulp.task('scripts', function() {
    return gulp.src(['src/js/mathjax.js', 'src/js/url_exist.js' ,'src/js/*.js'])
        .pipe(concat('javascript.js'))
        .pipe(uglify())
        .pipe(gulp.dest('dist'));
    }
);


gulp.task("styles", function() {
    return gulp.src("src/css/*.css")
        .pipe(concat("styles.css"))
        .pipe(cleanCSS())
        .pipe(gulp.dest("dist"));
});


gulp.task('default', gulp.parallel('scripts', 'styles'));