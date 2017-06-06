var gulp = require("gulp");
var sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
var plumber = require('gulp-plumber');
var browserSync = require('browser-sync');

gulp.task("css",function(){
    gulp.src("src/sass/main.scss")
    
        //plumber powoduje, że gdy wystąpi błąd nie kończy się nasłuchiwanie    
        .pipe(plumber())
        .pipe(sass.sync())  //aby sass dzialał z plumberem trzeba dodać sync
        .pipe(autoprefixer({
            browsers: ["last 5 version"]
        }))
        .pipe(gulp.dest("src/css"))
        .pipe(browserSync.stream()); //przy każdej zmianie w css zmiany zostaną wstrzyknięte na stronę i strona odświeżona
});


//dla browserSync
gulp.task("server",function(){
    browserSync.init({
        server:"src/"
    });
});

//nasłuchiwanie plików
//pliki css poddaj funkcji "css"
gulp.task("watch",function(){
    gulp.watch("src/sass/**/*.scss",["css"]);
    gulp.watch(["src/*.html", "src/**/*.js"],browserSync.reload); //przeładowanie dla index.html i js w dowolnych katalogach
})



//default ważne słowo --> dla gulp
//dzięki default mogę wpisać samo gulp w konsolę

gulp.task("default",["css","server","watch"]);