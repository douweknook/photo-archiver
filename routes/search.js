// Require express
const express	= require('express')
const router 	= express.Router()
const fs 		= require('fs')

// Require database
const db 		= require(__dirname + '/../modules/database')

router.post('/search', (req, res) => {
	console.log(req.session.user)
	if (req.session.user) {
		// Split search terms on spaces
		let terms = req.body.query.split(' ')
		
		// Transform terms for matching on substrings as well
		terms = terms.map( term => {
			return '%' + term + '%'
		})

		// Search for photos with labels matching any of the terms (or substrings)
		db.Photo.findAll({
			include: [{
				model: db.Label,
				where: {
					name: { $iLike: { $any: terms } }
				}
			}]
		}).then( results => {
			// Only return datavalues
			results = results.map( result => {
				return result.dataValues
			})
			// Send results to client
			res.status(200).send(results)
		}).catch( err => {
			res.status(500).send('Something went wrong. Please try again.')
		})
	} else {
		res.status(200).send(false)
	}
})

router.get('/uploads/:file', (req, res) => {
	// Maybe this shouldnt be an entirely open route
	// Need to check if these images are for this user?
	file = req.params.file
	let img = fs.readFileSync(__dirname + '/../uploads/' + file)
	res.writeHead(200, { 'Content-Type': 'image/jpg' } )
	res.end(img, 'binary')
})

router.post('/removelabel', (req, res) => {
	Promise.all([
		// Find the photo fro which label should be removed
		db.Photo.findOne({
			where: {name: req.body.photo}
		}),
		// Find the label to remove
		db.Label.findOne({
			where: {name: req.body.label}
		})
	]).then( allResults => {
		// Remove the label from the photo
		allResults[0].removeLabels([ allResults[1] ])
	})
})

router.post('/addlabel', (req, res) => {
	// Find the photo to add label to
	db.Photo.findOne({
		where: {name: req.body.photo}
	}).then( photo => {
		// Find the label to remove
		db.Label.findOrCreate({
			where: {name: req.body.label}
		}).spread( (label, created) => {
			if (created === true) {
				// Set the association between label and photo
				label.setPhotos([photo])
			} else {
				// Add a new association between existing label and new photo
				label.addPhotos([photo])
			}
		})
	})
})

module.exports = router