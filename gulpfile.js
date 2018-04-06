const gulp = require('gulp');

var sass 			 = require('gulp-sass'),
	autoprefixer 	 = require('gulp-autoprefixer'),
	cssnano      	 = require('gulp-cssnano'), // Подключаем пакет для минификации CSSpngquant     	 = require('imagemin-pngquant'), // Подключаем библиотеку для работы с png
	uglify       	 = require('gulp-uglify'),
	browserSync 	 = require('browser-sync');
	
//++++++++++++++++++++++++++++++++++++++++++++++++

const {phpMinify} = require('@cedx/gulp-php-minify');

var uglify = require('gulp-uglify');
var pump = require('pump');

var uglifyjs = require('uglify-js'); // can be a git checkout 
                                     // or another module (such as `uglify-es` for ES6 support) 
var composer = require('gulp-uglify/composer');
 
var minify = composer(uglifyjs, console);

//^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
gulp.task('minify:php', () => gulp.src('path/to/lib/**/*.php', {read: false})
  .pipe(phpMinify())
  .pipe(gulp.dest('path/to/out'))
);

//++++++++++++++++++++++++++++++++++++++++++++++++	
	
gulp.task('sass',function (){
  return gulp.src(['app/sass/**/*.sass','app/sass/**/*.scss'])
  .pipe(sass({outputStyle:'expanded'}).on('error',sass.logError))
  .pipe(gulp.dest('app/css'))
});

gulp.task('autoprefixer', () =>
    gulp.src('app.css')
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(gulp.dest('dist/css'))
);

//=========== Images ==================================

gulp.task('compress', function (cb) {
  // the same options as described above 
  var options = {};
 
  pump([
      gulp.src('lib/*.js'),
      minify(options),
      gulp.dest('dist')
    ],
    cb
  );
});


gulp.task('scripts', function() {
    return gulp.src([ // Берем все необходимые библиотеки
        'app/libs/jquery/dist/jquery.min.js', // Берем jQuery
        'app/libs/magnific-popup/dist/jquery.magnific-popup.min.js' // Берем Magnific Popup
        ])
        .pipe(concat('libs.min.js')) // Собираем их в кучу в новом файле libs.min.js
        .pipe(uglify()) // Сжимаем JS файл
        .pipe(gulp.dest('app/js')); // Выгружаем в папку app/js
});

gulp.task('css-libs', ['sass'], function() {
    return gulp.src('app/css/style.css') // Выбираем файл для минификации
        .pipe(cssnano()) // Сжимаем
        .pipe(rename({suffix: '.min'})) // Добавляем суффикс .min
        .pipe(gulp.dest('dist/css')); // Выгружаем в папку dist/css
});

gulp.task('watch', ['browser-sync', 'css-libs', 'scripts'], function() {
    gulp.watch('app/sass/**/*.sass', ['sass']); // Наблюдение за sass файлами в папке sass
    gulp.watch('app/*.html', browserSync.reload); // Наблюдение за HTML файлами в корне проекта
    gulp.watch('app/*.php', browserSync.reload);
	gulp.watch('app/js/**/*.js', browserSync.reload);   // Наблюдение за JS файлами в папке js
});

gulp.task('clean', function() {
    return del.sync('dist'); // Удаляем папку dist перед сборкой
});



//=========== Prodaction ==============================
gulp.task('build', ['clean', 'img', 'sass', 'scripts'], function() {

    var buildCss = gulp.src([ // Переносим библиотеки в продакшен
        'app/css/main.css',
        'app/css/libs.min.css'
        ])
    .pipe(gulp.dest('dist/css'))

    var buildFonts = gulp.src('app/fonts/**/*') // Переносим шрифты в продакшен
    .pipe(gulp.dest('dist/fonts'))

    var buildJs = gulp.src('app/js/**/*') // Переносим скрипты в продакшен
    .pipe(gulp.dest('dist/js'))

    var buildHtml = gulp.src('app/*.html') // Переносим HTML в продакшен
    .pipe(gulp.dest('dist'));

});


gulp.task('watch', function(){
  gulp.watch(['app/sass/**/*.sass','app/sass/**/*.scss'],['sass']);
});

gulp.task('default',['watch']);