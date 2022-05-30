const { Op } = require("sequelize")
const Transaction = require("../models/transaction.js")
const User = require("../models/user.js")

/*
Returns label and amount of all account transactions
*/
exports.getTransactions = async function(req, res, next) {
	await Transaction.findAll({
		where: {
			[Op.or]:[
				{destUid: req.user.uid},
				{sourceUid: req.user.uid}
			]
		}
	})
	.then(transactions => {
		
		transactionsOverview = []
		if(transactions) {
			
			transactions.forEach(transaction => {
				
				var overview = {}
				overview.amount = transaction.amount
				overview.id = transaction.id
				overview.hasSent = (req.user.uid === transaction.sourceUid)	//  True if client emitted the transaction
				transactionsOverview.push(overview)
			})
			
		}
		
		return res.json(transactionsOverview)
	})
	.catch(err => {
		return next()
	})
}

/*
Expects transaction ID in order to return transaction details (amount, destination, source, comment)
If the user is not the destination nor the source, transaction details won't be disclosed
*/
exports.getTransactionDetails = async function(req, res, next) {
	await Transaction.findOne({
		where: {
			[Op.and]: [
				{id: req.params.transactionId},
				{[Op.or]: [
					{sourceUid: req.user.uid},
					{destUid: req.user.uid}
				]}
			]
		}
	})
	.then(transaction => {
		if(transaction) {
			return res.json(transaction)
		}
		return res.status(404).json({"error": "This transaction may not exist."})
	})
	.catch(err => {
		next()
	})
}

/*
Edit transaction comment
Only destination and source account can modify it
*/
exports.editLabel = async function(req, res, next) {
	await Transaction.findOne({
		where: {
			[Op.and]: [
				{id: req.params.transactionId},
				{[Op.or]: [
					{sourceUid: req.user.uid},
					{destUid: req.user.uid}
				]}
			]
		}
	})
	.then(async function(transaction) {
		if(transaction) {
			transaction.set({
				comment: req.body.comment
			})
			await transaction.save()
			.then(() => {
				return res.json({"Success": "True"})
			})
			.catch(err => {
				next()
			})
		}
		return res.status(404).json({"error": "This transaction may not exist."})
	})
	.catch(err => {
		next()
	})
}

/*
Delete a transaction. Once the transaction is deleted, both source and destination accounts 
won't be able to retreive details from this transaction.
However, account balances of this transaction won't be modified.
*/
exports.deleteTransaction = async function(req, res, next) {
	var userId = req.user.uid;
	await Transaction.findOne({
		where: {
			[Op.and]: [
				{id: req.params.transactionId},
				{[Op.or]: [
					{sourceUid: req.user.uid},
					{destUid: req.user.uid}
				]}
			]
		}
	})
	.then(async function(transaction) {
		if(transaction) {
			await transaction.destroy()
			.then(() => {
				return res.json({"Success": "True"})
			})
			.catch(err => {
				next()
			})
		}
		return res.status(404).json({"error": "This transaction may not exist."})
	})
	.catch(err => {
		next()
	})
}

/*
Create a new transaction. amount, destination account are required.
comment is optionnal and can be modified later on.
The creation of a transaction will modify source and destination account balances
Transaction with a negative amount or an amount superior to user's balance are rejected.
This operation will add a transaction record in source and destination transaction history 
*/
exports.createTransaction = async function(req, res, next) {
	var amount = parseFloat(req.body.amount)
	var destinationId = req.body.destinationId
	var comment = req.body.comment || ""
	
	if(!amount || !destinationId) {
		return res.status(400).json({"error": "Parameters amount and destinationId are mandatory."})
	}
	
	if(amount === NaN || !isFinite(amount)) {
		return res.status(400).json({"error": "Amount must be float."})
	}
	
	if(amount < 0) {
		return res.status(400).json({"error": "Amount must be positive."})
	}
	
	await User.findOne({where: {
		uid: destinationId
	}})
	.then(async function(destUser) {
		if(!destUser) {
			return res.status(404).json({"error": "User not found"})
		}
		//  Update logged user
		await User.findOne({ where: {
			uid: req.user.uid		
		}})
		.then(async function(srcUser) {
			if(amount > srcUser.balance) {
				return res.status(400).json({"error": "Amount is superior to account balance."})
			}
			
			if(srcUser.uid === destinationId) {
				return res.status(400).json({"error": "Source and destination must be different."})
			}

			await Transaction.create({
				sourceUid: srcUser.uid,
				destUid: destUser.uid,
				comment: comment,
				amount: amount
			})
			.then(async function(transaction) {
				return Promise.all([
					srcUser.update({"balance": srcUser.balance-amount}),
					destUser.update({"balance": destUser.balance+amount})
				])
			})
			.then(() => {
				return res.json({"Success": "True"})
			})
			.catch(err => {
				return next()
			})
		})
		.catch(err => {
			return next()
		})
	})
	.catch(err => {
		next()
	})
}
