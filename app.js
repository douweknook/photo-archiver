// Require modules
const dotenv	= require('dotenv').load()
const vision 	= require('node-cloud-vision-api')

vision.init({auth: process.env.GCLOUD_API_KEY})

const app 		= require(__dirname + '/modules/express')
const db 		= require(__dirname + '/modules/database')

// Mount routes
app.use('/', require(__dirname + '/routes/login'))
app.use('/', require(__dirname + '/routes/upload'))
app.use('/', require(__dirname + '/routes/search'))

app.listen(8000, () => {
	console.log('Server listening...')
})