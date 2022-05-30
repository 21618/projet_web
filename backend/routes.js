let router = require("express").Router()
const userController = require("./controllers/user")
const transactionController = require("./controllers/transactions")

//  User endpoints
router.post("/login",	 	userController.login)
router.post("/register", 	userController.register)
router.get("/logout", 		userController.logout)
router.get("/profile", 	userController.profile)

//  Transactions endpoints
router.get("/transactions",		transactionController.getTransactions)
router.get("/details/:transactionId",	transactionController.getTransactionDetails)
router.post("/createTransaction",	transactionController.createTransaction)
router.put("/edit/:transactionId",	transactionController.editLabel)
router.delete("/delete/:transactionId",transactionController.deleteTransaction)

router.get("*", (req, res) => {
	res.status(404).json({"Error": "Route not found."})
})

router.post("*", (req, res) => {
	res.status(404).json({"Error": "Route not found."})
})

module.exports = router
