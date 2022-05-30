const UUID = require("short-unique-id")
var jwt = require('jsonwebtoken');
const crypto = require("crypto")

const User = require("../models/user.js")
const Transaction = require("../models/transaction.js")

const jwt_secret_key = "qeWZUA956GxL5y3s6mbiDZZ27fC7REUd"  //  move to config
const pbkdf2_salt = "PqhE5qHtD9gJaLvk"	//  mode to config
const min_pass_len = 10
const max_pass_len = 20

/*
User password stored in database is hashed with pbkdf2 algorithm
*/
hashPassword = async function(password) {
	return new Promise((resolve, reject) => {
		crypto.pbkdf2(password, pbkdf2_salt, 10000, 64, 'sha512', (err, derivedKey) => {
			if(err) {
				reject(err)
			} else {
				resolve(derivedKey.toString('hex'))
			}
		})
	})
}

/*
Authentication requires 2 parameters : User ID and password
If the request is successfull, the API will set a JWT in user cookies
This token allows the user to use authenticated API calls such as transaction API
*/
exports.login = async function(req, res, next) {
	var uid = req.body.uid
	var password = req.body.password

	if(!uid || !password) {
		return res.status(400).json({
			"Bad request": "UID and password are required."
		})
	}
	await hashPassword(password)
	.then(async function(hash) {
		await User.findOne({
			where: {
				uid: uid,
				password: hash
			}
		})
		.then((user) => {
			if(user) {
				var sessionToken = jwt.sign(
					{"uid": uid},
					jwt_secret_key,
					{"expiresIn": 24000}	//  10 mins prod
				)
				res.cookie("Session", sessionToken, {
					httpOnly: true,
				})
				return res.json({"success": "true"})
			}
			return res.status(401).json({"Unauthorized": "Wrong credentials"})
		})
	})
	.catch(err => {
		return next()
	})
}

/*
Register functionnality expects a firstname and password
Password length must be contained between 10 and 20

An ID will be generated for the authentication
ID are unique and corresponds to the user's ID
*/
exports.register = async function(req, res, next) {
	var firstname = req.body.firstname
	var password = req.body.password
	
	if(!firstname || !password) {
		return res.status(400).json({
			"Bad request": "Username and password are required."
		})
	}
	if(password.length < min_pass_len || password.length > max_pass_len) {
		return res.status(400).json({
			"Bad request" : `Password length must be between ${min_pass_len} and ${max_pass_len} caracters.`
		})
	}
	
	var uid = new UUID({
		dictionary: "number",
		length: 7
	})()
	
	await hashPassword(password)
	.then(async function(hash) {
		await User.create({
			uid: uid,
			firstname: firstname,
			password: hash,
			balance: 100.0
		})
		.then(res.json({"uid": uid}))
	})
	.catch(err => {
		return next()
	})
}

/* returns firstname and balance, transactions are returned by transaction API */
exports.profile = async function(req, res, next) {
	await User.findOne({
		where: {
			uid: req.user.uid
		},
		attributes : [
			"firstname",
			"balance"
		]
	})
	.then(userinfo => {
		return res.json({"profile": {
			"firstname": userinfo.firstname,
			"balance": userinfo.balance 
		}})
	})
	.catch(err => {
		return next()
	})
	
}

/* revoke session token by overriding it */
exports.logout = async function(req, res, next) {
	res.clearCookie("Session")
	return res.json({"Session revoked": "true"})
}

