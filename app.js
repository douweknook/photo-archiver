// Require modules
const dotenv	= require('dotenv').load()
const vision 	= require('node-cloud-vision-api')

vision.init({auth: process.env.GCLOUD_API_KEY})

const app 		= require(__dirname + '/modules/express')
const db 		= require(__dirname + '/modules/database')

// Mount routes
app.use('/', require(__dirname+'/routes/login'))
app.use('/', require(__dirname+'/routes/upload'))

// Google Vision API test code. Docs: https://github.com/tejitak/node-cloud-vision-api
// const req = new vision.Request({
// 	image: new vision.Image('test_image.jpg'),
// 	features: [ new vision.Feature('LABEL_DETECTION', 10) ]
// })

// // send single request
// vision.annotate(req).then((res) => {
// 	// handling response
// 	console.log(JSON.stringify(res.responses, null, 2))
// }, (e) => {
// 	console.log('Error: ', e)
// })
// Test code tot hier!

app.listen(8000, () => {
	console.log('Server listening...')
})