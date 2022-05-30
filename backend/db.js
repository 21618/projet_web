const Sequelize = require("sequelize")
const sequelize = new Sequelize(
	"webproject",
	"node",
	"i9X3rqQDhoM2ULxm",
	{
		host: "localhost",
		dialect: "mysql"
})
//sequelize.sync({force:true})
sequelize.sync()

module.exports = sequelize
