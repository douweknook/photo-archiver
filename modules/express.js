// Require modules
const express		= require('express')
const session 		= require('express-session')
const bodyParser 	= require('body-parser')

// Initialize app
const app = express()


// Set static views
app.use(express.static(__dirname+'/../frontend/static'))

// Set body parser for incoming form data
app.use( bodyParser.urlencoded( {extended: true} ) )

// Set settings for sessions
app.use(session({
	secret: process.env.SESSION_SECRET,
	resave: false,
	saveUninitialized: false,
	cookie: {
		secure: false,
		maxAge: 24*60*60*1000
	}
}))

app.get('/mentor', (req, res) => {
	console.log(req.session)
	if ( req.session.mentor ) {
		res.send('Hello again Mentor')
	} else {
		res.send('Hello Mentor')
	}
	
	req.session.mentor = 'again'
})

module.exports = app