# Installer TypeScript

## Typescript

Installer globalement TypeScript avec NPM:

    $ npm install -g typescript
    
Compiler pour exemple:

    $ tsc greeter-basic.ts

## Installer Tslint

Installer globalement:

    $ npm i -g tslint typescript

Initialiser dans le projet:

    $ cd project/
    $ tslint --init
    
Analyser un fichier:

    $ tslint -c tslint.json greeter-basic.ts 

## Utiliser Gulp:

Installer:

    $ npm i -g gulp  
    $ npm i --save-dev gulp typescript tslint gulp-tslint gulp-typescript

Créer un gulpfile avec une tâche basique:

    // surveillance
    gulp.task('tslint', function () {
            gulp.src(tsFiles)
                .pipe(tslint({
                    formatter: 'prose'
                }))
                .pipe(tslint.report())
                .on('error', function (error) {
                    console.log("Errors happened");
                    //console.log("Errors: " + error['message']);
                });
        }
    );
    
    // compilation
    gulp.task('tsc', function () {
            gulp.src(tsFiles) 
                .pipe(ts({
                    outFile: 'output.js'
                }))
                .pipe(gulp.dest(distDir));
        }
    );
    
Plus de renseignements sur: https://www.npmjs.com/package/gulp-typescript

