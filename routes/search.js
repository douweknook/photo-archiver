// Require express
const express	= require('express')
const router 	= express.Router()
const fs 		= require('fs')

const Promise 	= require('bluebird')

// Require database
const db 		= require(__dirname + '/../modules/database')

router.post('/search', (req, res) => {
	if (req.session.user) {
		// Split search terms on spaces
		let terms = req.body.query.split(' ')
		
		// Transform terms for matching on substrings as well
		terms = terms.map( term => {
			return '%' + term + '%'
		})

		// Search for photos with labels matching any of the terms (or substrings)
		db.Photo.findAll({
			where: {
				'userId': req.session.user.id,
				'$labels.name$': { $iLike: { $any: terms} }
			},
			include: [db.Label]
		}).then( results => {
			// Use Promise.map to keep everything in order
			Promise.map(results, result => {
				// Return all label names for each photo
				return result.getLabels({attributes: ['name']}).then( labels => {
					result.dataValues.labels = labels
				})
			}).then( () => {
				// Send results to client
				res.status(200).send(results)
			})		
		}).catch( err => {
			console.log(err)
			res.status(500).send('Something went wrong. Please try again.')
		})
	} else {
		res.status(200).send(false)
	}
})

router.get('/uploads/:file', (req, res) => {
	if (req.session.user) {
		file = req.params.file
		let img = fs.readFileSync(__dirname + '/../uploads/' + file)
		res.writeHead(200, { 'Content-Type': 'image/jpg' } )
		res.end(img, 'binary')
	}
})

router.post('/removelabel', (req, res) => {
	if (req.session.user) {
		Promise.all([
			// Find the photo from which label should be removed
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
	}
})

router.post('/addlabel', (req, res) => {
	if (req.session.user) {
		// Find the photo to add label to
		db.Photo.findOne({
			where: {name: req.body.photo}
		}).then( photo => {
			// Find or create the label to add
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
	}
})

router.post('/changetitle', (req, res) => {
	if (req.session.user) {
		// Update title for photo which hash name matches
		db.Photo.update(
			{ originalName: req.body.newTitle },
			{ where: { name: req.body.name } }
		)
	}
})

module.exports = router