// Require express
const express	= require('express')
const router 	= express.Router()

// Require database
const db 		= require(__dirname + '/../modules/database')

// Require and set up multer parser
const multer 	= require('multer')
const upload 	= multer({ dest: __dirname + '/../uploads/' }) 

// Require and initialize Google Vision API
const vision 	= require('node-cloud-vision-api')
vision.init( {auth: process.env.GCLOUD_API_KEY} )

// Upload route
router.post('/upload', upload.array('files'), (req, res) => {
	console.log(req.session)
	if (req.session.user) {
		// TODO: Check if loged in (req.session.user)
		// TODO: Check if files are .jpg or .png

		db.Photo.count().then( count => {
			// Go over each uploaded file
			req.files.forEach( file => {
				// Create entry in photos table
				db.Photo.create({
					name: 			file.filename,
					originalName: 	file.originalname,
					path: 			file.path,
					mimetype: 		file.mimetype,
					userId: 		req.session.user.id
				}).then( photo => {
					// Set up request to Google Vision API
					let visionReq = new vision.Request({
						image: new vision.Image(file.path),
						features: [ 
							new vision.Feature('LABEL_DETECTION'), 
						] 
					})
					annotateImage(photo, visionReq)
				})
			})

			
			// Store intervalID to cancel intervals later on
			let intervalID
			// Check every 5 seconds if annotation of all images is done
			intervalID = setInterval( () => {
				checkUploadStatus(count, req.files.length, res, intervalID)
			}, 5000 )
		} )
	} else {
		res.status(200).send(false)
	}
})

// Get annotations for image, store labels in db, connect labels to image.
function annotateImage(image, visionReq) {
	// Execute Vision request
	vision.annotate(visionReq).then( visionRes => {
		let labels = visionRes.responses[0].labelAnnotations
		// Go over each label for photo
		labels.forEach( item => {
			// Check if the probability score is above 0.7
			if (item.score > 0.7) {
				// Create new entry in labels table if not existing yet
				db.Label.findOrCreate({
					where: { name: item.description },
					defaults: { name: item.description } // execute default if non-existing yet
				}).spread( (label, created) => {
					// If existing yet, created === false
					if (created === true) {
						// Set the association between label and photo
						label.setPhotos([image])
					} else {
						// Add a new association between existing label and new photo
						label.addPhotos([image])
					}
				})
			}
		})
	})
}

// Check if all images are annotated
function checkUploadStatus(oldCount, amountOfFiles, res, intervalID) {
	// Count all photos in db
	db.Photo.count().then( currentCount => {
		// Compare amounts (same if all are done)
		if (currentCount === (oldCount + amountOfFiles) ) {
			// Send reponse status
			res.status(200).send('upload successful')
			// clear intervals
			clearInterval(intervalID)
		}
	})
}


module.exports = router
