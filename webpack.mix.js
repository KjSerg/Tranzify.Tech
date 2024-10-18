const mix = require('laravel-mix');
const autoprefixer = require('autoprefixer');

mix.sass('resources/sass/app.scss', 'css', {
    sassOptions: {
        outputStyle: 'expanded' // Щоб зберегти формат SCSS, який ближче до оригінального
    }
}).options({
    postCss: [
        autoprefixer({
            overrideBrowserslist: ['last 6 versions'],
            grid: true
        })
    ]
});