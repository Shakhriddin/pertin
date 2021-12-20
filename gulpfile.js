const { src, dest, watch, series, parallel, task } = require('gulp');
let fs = require('fs');

const projectFolder = require('path').basename(__dirname);
const sourceFolder = '#src';
const path = {
  build: {
    html: projectFolder + '/',
    css: projectFolder + '/css/',
    js: projectFolder + '/js/',
    img: projectFolder + '/images/',
    fonts: projectFolder + '/fonts/',
  },
  src: {
    html: [sourceFolder + '/*.html', '!' + sourceFolder + '/_*.html'],
    css: sourceFolder + '/scss/style.scss',
    js: sourceFolder + '/js/main.js',
    img: sourceFolder + '/images/**/*.{jpg,png,svg,gif,ico,webp}',
    fonts: sourceFolder + '/fonts/**/*.{ttf, woff, woff2}',
  },
  watch: {
    html: sourceFolder + '/**/*.html',
    css: sourceFolder + '/scss/**/*.scss',
    js: sourceFolder + '/js/**/*.js',
    img: sourceFolder + '/images/**/*.{jpg,png,svg,gif,ico,webp}',
  },
  clean: './' + projectFolder + '/',
};

const browsersync = require('browser-sync').create();
const fileinclude = require('gulp-file-include');
const del = require('del');
const scss = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const groupMedia = require('gulp-group-css-media-queries');
const cleanCss = require('gulp-clean-css');
const rename = require('gulp-rename');
const uglify = require('gulp-uglify-es').default;
const imagemin = require('gulp-imagemin');
const webp = require('gulp-webp');
const webphtml = require('gulp-webp-html');
const svgSprite = require('gulp-svg-sprite');
const ttf2woff = require('gulp-ttf2woff');
const ttf2woff2 = require('gulp-ttf2woff2');
const fonter = require('gulp-fonter');
const gulpif = require('gulp-if');
const image = require('gulp-image');
const webpcss = require('gulp-webpcss');
let isProd = false;

function browserSync() {
  browsersync.init({
    server: {
      baseDir: './' + projectFolder + '/',
    },
    port: 3000,
    notify: false,
  });
}

function html() {
  return src(path.src.html)
    .pipe(fileinclude())
    .pipe(webphtml())
    .pipe(dest(path.build.html))
    .pipe(browsersync.stream());
}

function css() {
  return src(path.src.css)
    .pipe(scss({ outputStyle: 'compressed' }))
    .pipe(groupMedia())
    .pipe(
      autoprefixer({
        overrideBrowserslist: ['last 5 versions'],
        cascade: true,
        grid: true,
      })
    )
    .pipe(webpcss())
    .pipe(dest(path.build.css))
    .pipe(cleanCss())
    .pipe(rename({ extname: '.min.css' }))
    .pipe(dest(path.build.css))
    .pipe(browsersync.stream());
}

function js() {
  return src(path.src.js)
    .pipe(fileinclude())
    .pipe(dest(path.build.js))
    .pipe(uglify())
    .pipe(rename({ extname: '.min.js' }))
    .pipe(dest(path.build.js))
    .pipe(browsersync.stream());
}

function images() {
  return src(path.src.img)
    .pipe(
      webp({
        quality: 70,
      })
    )
    .pipe(dest(path.build.img))
    .pipe(src(path.src.img))
    .pipe(dest(path.build.img))
    .pipe(src(path.src.img))
    .pipe(
      imagemin([
        imagemin.gifsicle({ interlaced: true }),
        imagemin.mozjpeg({ quality: 75, progressive: true }),
        imagemin.optipng({ optimizationLevel: 3 }),
        imagemin.svgo({
          plugins: [{ removeViewBox: true }, { cleanupIDs: false }],
        }),
      ])
    )

    .pipe(dest(path.build.img))
    .pipe(browsersync.stream());
}

function imgMin() {
  return src([
    './#src/images/**.jpg',
    './#src/images/**.png',
    './#src/images/**.jpeg',
    './#src/images/*.svg',
    './#src/images/**/*.jpg',
    './#src/images/**/*.png',
    './#src/images/**/*.jpeg',
  ])
    .pipe(gulpif(isProd, image()))
    .pipe(dest(path.build.img));
}

function fonts() {
  src(path.src.fonts).pipe(ttf2woff()).pipe(dest(path.build.fonts));
  return src(path.src.fonts).pipe(ttf2woff2()).pipe(dest(path.build.fonts));
}

task('otf2ttf', () => {
  return src([sourceFolder + '/fonts/*.otf'])
    .pipe(
      fonter({
        formats: ['ttf'],
      })
    )
    .pipe(dest(sourceFolder + '/fonts/'));
});

// function fontsStyle() {
//   const fileContent = fs.readFileSync(sourceFolder + "/scss/fonts.scss");
//   if (fileContent == "") {
//     fs.writeFile(sourceFolder + "/scss/fonts.scss", "", cb);
//     return fs.readdir(path.build.fonts, function (err, items) {
//       if (items) {
//         let cFontname;
//         for (let i = 0; i < items.length; i++) {
//           let fontname = items[i].split(".");
//           fontname = fontname[0];
//           if (cFontname != fontname) {
//             fs.appendFile(
//               sourceFolder + "/scss/fonts.scss",
//               '@include font("' +
//                 fontname +
//                 '", "' +
//                 fontname +
//                 '", "400", "normal");\r\n',
//               cb
//             );
//           }
//           cFontname = fontname;
//         }
//       }
//     });
//   }
// }

function fontsStyle(params) {
  let file_content = fs.readFileSync(sourceFolder + '/scss/fonts.scss');
  if (file_content == '') {
    fs.writeFile(sourceFolder + '/scss/fonts.scss', '', cb);
    return fs.readdir(path.build.fonts, function (err, items) {
      if (items) {
        let c_fontname;
        for (let i = 0; i < items.length; i++) {
          let fontname = items[i].split('.');
          fontname = fontname[0];
          if (c_fontname != fontname) {
            fs.appendFile(
              sourceFolder + '/scss/fonts.scss',
              '@include font("' +
                fontname +
                '", "' +
                fontname +
                '", "400", "normal");\r\n',
              cb
            );
          }
          c_fontname = fontname;
        }
      }
    });
  }
}

function cb() {}

function svgsprite() {
  return src([sourceFolder + '/iconsprite/*.svg'])
    .pipe(
      svgSprite({
        mode: {
          stack: {
            sprite: '../icons/icons.svg', // sprite file name
            example: true,
          },
        },
      })
    )
    .pipe(dest(path.build.img));
}

function watching() {
  watch([path.watch.html], html);
  watch([path.watch.css], css);
  watch([path.watch.js], js);
  watch([path.watch.img], images);
}

function cleanDist() {
  return del(path.clean);
}

exports.imgMin = imgMin;
exports.svgsprite = svgsprite;
exports.fontsStyle = fontsStyle;
exports.fonts = fonts;
exports.images = images;
exports.js = js;
exports.css = css;
exports.html = html;
exports.watching = watching;
exports.build = series(
  cleanDist,
  parallel(images, js, css, html, fonts),
  fontsStyle
);
exports.default = parallel(
  series(cleanDist, parallel(images, js, css, html, fonts), fontsStyle),
  watching,
  browserSync
);
