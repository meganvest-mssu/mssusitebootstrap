var gulp = require('gulp');
var browserSync = require('browser-sync').create();
var cssmin = require('gulp-cssmin');
var sass = require('gulp-sass');
var nunjucksRender = require('gulp-nunjucks-render');
var newer = require('gulp-newer');
var reload = browserSync.reload;
var src = {
    scss: 'src/scss/**/*.scss'
    , css: 'src/css/'
    , njk: 'src/**/*.njk'
    , dist: 'dist/'
};
gulp.task('serve', ['scss', 'nunjucks'], function () {
    browserSync.init({
        server: "./dist"
    });
    gulp.watch(src.njk, ['nunjucks']);
    gulp.watch(src.scss, ['scss']);
    gulp.watch("dist/index.html").on('change', reload);
});
// Converting njk files to html
gulp.task('nunjucks', function () {
    return gulp.src('src/pages/**/*.+(html|njk|nunjucks)')
        // We do not need the data.json for this demo but you can use it if you wanna
        //.pipe(data(function(){
        //  return require('./app/data.json');
        //}))
        .pipe(nunjucksRender({
            path: ['src/templates/']
        })).pipe(gulp.dest('dist')).pipe(reload({
            stream: true
        }));
});
// HTML Processing
gulp.task('html', ['images'], function () {
    return gulp.src(src.html).pipe(newer(src.html)).pipe(gulp.dest(src.dist));
});
// Converting scss files to css files
gulp.task('scss', function () {
    return gulp.src(src.scss).pipe(sass().on('error', sass.logError)).pipe(gulp.dest("dist/css")).pipe(reload({
        stream: true
    }));
});
gulp.task('default', ['serve']);
gulp.task('minify-css', ['sass', 'scss'], function () {
    return gulp.src(src.css + '**/*.css').pipe(cssmin()).pipe(gulp.dest(src.dist + 'css'));
});
gulp.task('production', ['nunjucks', 'html', 'minify-css']);