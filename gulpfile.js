const gulp 			= require('gulp')
const pug 			= require('gulp-pug')
const sass 			= require('gulp-sass')
const babel 		= require('gulp-babel')
const concat		= require('gulp-concat')
const watch 		= require('gulp-watch')
const notify 		= require('gulp-notify')

// Error handling
function swallowError (error) {

  // Details of the error in the console
  console.log( error.toString() )

  this.emit( 'end' )
}

const paths = {
	source: {
		root: 	__dirname,
		styles: __dirname + '/frontend/src/css/*.scss',
		js: 	__dirname + '/frontend/src/js/*.js',
		pug: 	__dirname + '/frontend/src/views/*.pug',
		fonts: 	__dirname + '/frontend/src/fonts/*',
		img: 	__dirname + '/frontend/src/img/*'
	},
	build: {
		root: 	__dirname + '/frontend/static/',
		styles: __dirname + '/frontend/static/css/',
		js: 	__dirname + '/frontend/static/js/',
		html: 	__dirname + '/frontend/static/',
		fonts: 	__dirname + '/frontend/static/fonts/',
		img: 	__dirname + '/frontend/static/img/'
	}
}

gulp.task( 'default', () => {
	gulp.start( 'watch' )
} )

gulp.task('css', () => {
	return gulp.src(paths.source.styles)
	.pipe( sass() )
	.on( 'error', swallowError )
	.pipe( concat('styles.css') )
	.pipe( gulp.dest( paths.build.styles ) )
})
 
gulp.task('fonts', () => {
	return gulp.src( paths.source.fonts )
	.pipe( gulp.dest( paths.build.fonts) )
})

gulp.task('img', () => {
	return gulp.src( paths.source.img )
	.pipe( gulp.dest( paths.build.img) )
})

gulp.task('js', () => {
	return gulp.src(paths.source.js) 
	.pipe( concat('main.js') )
	.pipe( babel({
		presets: ['es2015']
	}) )
	.on( 'error', swallowError )
	.pipe( gulp.dest( paths.build.js ) )
})

gulp.task('pug', () => {
	return gulp.src( paths.source.pug )
	.pipe( pug() )
	.on( 'error', swallowError )
	.pipe( gulp.dest( paths.build.html ) )
})

gulp.task('build', ['css', 'fonts', 'img', 'js', 'pug'], () => {})

gulp.task('watch', () => {
	notify('Watching for changes...').write('')
	gulp.start('build')
	gulp.watch(paths.source.js, ['js'])
	gulp.watch(paths.source.styles, ['css'])
	gulp.watch(paths.source.fonts, ['fonts'])
	gulp.watch(paths.source.img, ['img'])
	gulp.watch(paths.source.pug, ['pug'])
})