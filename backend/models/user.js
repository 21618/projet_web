const Sequelize = require('sequelize')
const db = require('../db.js')

const User = db.define("user", {
	uid : {
		type: Sequelize.STRING,
		allowNull: false,
		primaryKey: true
	},
	firstname: {
		type: Sequelize.STRING,
		allowNull: false
	},
	password: {	//   hex pdbkf2
		type: Sequelize.STRING,
		allowNull: false
	},
	balance: {
		type: Sequelize.FLOAT,
		allowNull: false
	}
})

module.exports = User
