const Sequelize = require('sequelize')
const db = require('../db.js')

const Transaction = db.define("transaction", {
	id : {
		type: Sequelize.INTEGER,
		allowNull: false,
		primaryKey: true,
		autoIncrement: true
	},
	sourceUid: {
		type: Sequelize.STRING,
		allowNull: false
	},
	destUid: {
		type: Sequelize.STRING,
		allowNull: false
	},
	comment: {
		type: Sequelize.STRING,
		allowNull: true
	},
	amount: {
		type: Sequelize.FLOAT,
		allowNull: false
	}
})

module.exports = Transaction
