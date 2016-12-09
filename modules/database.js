// Require modules
const sequelize		= require('sequelize')

let db = {}

// Initialize databae connection
db.conn = new sequelize(process.env.DB_NAME, process.env.DB_USERNAME, process.env.DB_PASSWORD, {
	server: 	process.env.DB_SERVER,
	dialect: 	process.env.DB_DIALECT
})

// Database models
db.User = db.conn.define('user', {
	username: 	{type: sequelize.STRING, unique: true},
	password: 	sequelize.STRING,
	email: 		{type: sequelize.STRING, unique: true}
})

db.Photo = db.conn.define('photo', {
	name: 			{type: sequelize.STRING, unique: true},
	originalName: 	sequelize.STRING,
	path: 			sequelize.STRING,
	mimetype: 		sequelize.STRING
})

db.Label = db.conn.define('label', {
	name: 	{type: sequelize.STRING, unique: true}
})

// Database relations
db.User.hasMany(db.Photo); db.Photo.belongsTo(db.User)

db.Photo.belongsToMany(db.Label, {through: 'photo_label'})
db.Label.belongsToMany(db.Photo, {through: 'photo_label'})

// Synchronize database
db.conn.sync().then( () => {
	console.log('Database synchronized...')
}, err => {
	console.log('Error: ' + err)
} )

module.exports = db