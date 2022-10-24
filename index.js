const chokidar = require('chokidar');
const sass = require('sass');
const fs = require('fs');
const browserSync = require('browser-sync');
const nunjucks = require('nunjucks');

nunjucks.configure({ autoescape: true });

// do we need to do anything with paths here?

// watch scss, recompile on save and refresh the browser

chokidar.watch('**/*.scss').on('change', path=> {
    const result = sass.compile('src/scss/site.scss', {'sourceMap':true, 'style': 'compressed' });
    fs.mkdirSync('./build/css/', { recursive: true });
    fs.writeFileSync('./build/css/site.css', result.css, 'utf-8');
    fs.writeFileSync('./build/css/site.css.map', JSON.stringify(result.sourceMap), 'utf-8' )
    console.log('✅ '+result.loadedUrls[0].pathname+' scss file updated · '+result.css.length+' character CSS file created');
    browserSync.reload();
});

// watch html and refresh on changes

chokidar.watch('./build/**/*.html').on('change', path=> {
    console.log('✅ html page updated: '+path);
    browserSync.reload();
});

// watch .njk files and build them into html

chokidar.watch(['./src/**/*.njk', './src/**/*.html']).on('change', path=> {
    const nunjucksString = fs.readFileSync(path, 'utf-8');
    const processNunjucks = nunjucks.renderString(nunjucksString, { testVar: 'A variable' });
    fs.mkdir('./build/', { recursive: true}, ()=>{
    fs.writeFileSync('./build/index.html', processNunjucks, {'encoding':'utf-8', 'flag':'w'});
    });
    console.log('✅ nunjucks file '+path+' updated');
    browserSync.reload();
});

// start browserSync

browserSync.init({
    server: {
        baseDir: './build/'
    }
});


