const express = require("express")
const cors = require("cors")
const jwt = require("express-jwt")
const cookies = require("cookie-parser")
const db = require("./db.js")
const app = express()

const bindPort = 8000

app.use(express.json())
app.use(cookies())
//  CORS for staging frontend
app.use(cors({
	credentials: true,		//  If this options is not set, CORS request will not use backend cookies
	origin: "http://localhost:4200"
}))
//  JWT verification
app.use(jwt({
	secret: "qeWZUA956GxL5y3s6mbiDZZ27fC7REUd",
	algorithms: ['HS256'],
	getToken: function parseCookie(req) {
		if(req.cookies.Session) {
			return req.cookies.Session
		}
		return ""
	}})
	.unless({path: [
		"/",
		"/login",
		"/register"
	]})
)
//  Define middleware error logger
app.use(function(err, req, res, next) {
	//  Invalid JWT
	if(err.name === "UnauthorizedError") {
		return res.status(401).json({"error": err.message})	//  Redirect if no authorization
	}
	//  Server error
	console.error(`[ERROR] ${err.stack}`)
	return res.status(500).json({"error": "An error occured, please retry later."})
})

app.use("/", require("./routes"))

app.listen(bindPort, () => {
	console.log(`[INFO] Server listening on port ${bindPort}`)
})
