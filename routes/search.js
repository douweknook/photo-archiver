// Require express
const express	= require('express')
const router 	= express.Router()
const fs 		= require('fs')

// Require database
const db 		= require(__dirname + '/../modules/database')

router.post('/search', (req, res) => {
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
})

router.get('/uploads/:file', (req, res) => {
	// Maybe this shouldnt be an entirely open route
	// Need to check if these images are for this user?
	file = req.params.file
	let img = fs.readFileSync(__dirname + '/../uploads/' + file)
	res.writeHead(200, { 'Content-Type': 'image/jpg' } )
	res.end(img, 'binary')
})

module.exports = router