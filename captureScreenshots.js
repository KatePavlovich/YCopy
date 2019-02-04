const path = require('path')
const glob = require('glob')
const Pageres = require('pageres')

console.log(__dirname)

glob
  .sync('public/*/*/index.html') // измените путь для вашего проекта
  .forEach((file) => {
    console.log(file)
    const pageres = new Pageres({
      crop: true,
      filename: 'screenshot-<%= size %>',
      delay: 2,
      css: '', // стили, которые вы хотите применить к странице перед созданием скриншота
      format: 'jpg',
      script: `var imgs = document.querySelectorAll("img"); 
      for (var index = 0; index < imgs.length; index++) {
        var element = imgs[index];
        var oldVal = element.getAttribute('src');
        element.setAttribute('src', oldVal.replace('/img','../../img'));
        
      }`,
      // script: `var imgs = document.querySelectorAll("img");
      //   imgs.forEach(function(img) {
      //      var oldVal = img.getAttribute('src');
      //      img.setAttribute('src', oldVal.replace('/img','../../img'));
      //   });`,
      //script: `  document.getElementsByTagName('body')[0].style.backgroundColor = 'red'`,
    })

    pageres
      .src(file, ['1200x630', '600x315']) // рекомендуемые размеры для Facebook и Twitter
      .dest(path.dirname(file))
      .on('warning', (warn) => {
        console.log(warn)
      })
      //.dest(__dirname)
      .run((err) => {
        if (err) {
          console.log(err) // eslint-disable-line no-console
        }
      })
  })

// const pageres = new Pageres({delay: 2})
// .src('https://yolifeis.netlify.com/post/2018-06-24_vse-o-shafrane-esche-raz', ['480x320', '1024x768', 'iphone 5s'], {crop: true})
// //.src('todomvc.com', ['1280x1024', '1920x1080'])
// //.src('data:text/html;base64,PGgxPkZPTzwvaDE+', ['1024x768'])
// .dest(__dirname)
// .run()
// .then(() => console.log('done'));
