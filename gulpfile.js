var gulp = require('gulp');
var browserSync = require('browser-sync').create();
var cssmin = require('gulp-cssmin');
var sass = require('gulp-sass');
var nunjucks = require('gulp-nunjucks');
var data = require('gulp-data');
var nunjucksRender = require('gulp-nunjucks-render');
var newer = require('gulp-newer');
var reload = browserSync.reload;
var autoprefixer = require('gulp-autoprefixer');
var src = {
    scss: 'src/scss/**/*.scss',
    css: 'src/css/',
    njk: 'src/**/*.njk',
    dist: 'dist/'
};
gulp.task('serve', ['scss', 'nunjucks', 'js'], function () {
    browserSync.init({
        open: false,
        server: "./dist"
    });
    gulp.watch(src.njk, ['nunjucks']);
    gulp.watch(src.scss, ['scss']);
    gulp.watch("dist/index.html").on('change', reload);
});
// Converting njk files to html
gulp.task('nunjucks', function () {
    return gulp.src('src/pages/**/*.+(html|njk|nunjucks)')
        /*.pipe(data(function () {
            return requireUncached('./src/data/test.json');
        }))*/
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
    return gulp.src(src.scss)
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(gulp.dest("dist/css"))
        .pipe(reload({
            stream: true
        }));
});
gulp.task('default', ['serve']);
gulp.task('minify-css', ['scss'], function () {
    return gulp.src(src.css + '**/*.css').pipe(cssmin()).pipe(gulp.dest(src.dist + 'csss'));
});
gulp.task('js', function () {
    return gulp.src('node_modules/jquery/dist/jquery.min.js')
        .pipe(gulp.dest('dist/js'));
});
gulp.task('production', ['nunjucks', 'html', 'minify-css']);


// De-caching for Data files
function requireUncached( $module ) {
    delete require.cache[require.resolve( $module )];
    return require( $module );
}