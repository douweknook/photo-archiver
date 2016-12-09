// Require modules
const bcrypt	= require('bcrypt')
const express	= require('express')
const router 	= express.Router()
const db 		= require(__dirname+'/../modules/database')

router.post('/login', (req, res) => {
	if (req.body.username.length === 0 || req.body.password.length === 0) {
		res.status(400).send( {error: 'Please fill in all fields.'} )
		return
	}

	db.User.findOne({
		where: { username: req.body.username }
	}).then( user => {
		if (user) {
			req.session.user = {
				id: 		user.id, 
				username: 	user.username, 
				email: 		user.email
			}
			res.status(200).send(req.session.user)
		} else {
			res.status(400).send( {error: 'Username does not exist.'} )
		}
	}).catch( error => {
		console.log(error)
		res.status(500).send( {error: 'Something went wrong. Please try again.'} )
	})
})

router.post('/register', (req, res) => {
	// Check if all fields are filled in
	if (req.body.username.lenght === 0 || req.body.password.length === 0 || 
		req.body.confirm_password.length === 0 || req.body.email.length === 0) {
		res.status(400).send( {error: 'Please fill in all fields.'} )
		return
	}
	// Check username for any weird characters
	let regex = /^\w+$/
	if (!regex.test(req.body.username)) {
		res.status(400).send( {error: 'Username may only contain letters, numbers and underscores.'} )
		return
	}

	//Check if password is minimun of 8 characters
	// if (req.body.password.length < 8 || req.body.password_check.length < 8) {
	// 	res.send('Password need to be at least 8 characters.')
	// 	return
	// }

	// Check if passwords match
	if (req.body.password !== req.body.confirm_password) {
		res.status(400).send( {error: 'Passwords do not match. Please try again.'} )
		return
	}

	// Encrypt password
	bcrypt.hash(req.body.password, 8, (err, hash) => {
		if (err) {
			res.status(500).send( {error: 'Something went wrong. Please try again.'} )
			return
		}
		// Store registered user in database
		db.User.create({
			username: 	req.body.username,
			password: 	hash,
			email: 		req.body.email
	 	}).then(user => {
	 		req.session.user = {
	 			id: 		user.id, 
	 			username: 	user.username, 
	 			email: 		user.email
	 		}
	 		res.status(200).send(req.session.user)
	 	}).catch(err => {
	 		console.log(err)
	 		res.status(500).send( {error: 'Username or email already in use.'} )
	 	})
	})
	
})

router.post('/authenticate', (req, res) => {
	if (req.session.user) {
		res.send(true)
	} else {
		res.send(false)
	}
})

module.exports = router