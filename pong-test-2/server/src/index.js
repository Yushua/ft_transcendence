import express from "express"
import cors from "cors"
import { StreamChat } from "stream-chat"
import { v4 as uuidv4 } from "uuid"
import bcrypt from "bcrypt"

const app = express()
app.use(cors())
app.use(express.json())

const api_key = "entzmdy54puu"
const api_secret = "6ep4racggrtw3wtgjqq4qq9suqtb6djjj47fpqutcym9w5j3paghkztr9hdthb7t"
const serverClient = StreamChat.getInstance(api_key, api_secret)

app.post("/signup", async (req, res) => {
	try {
		const { firstName, username, password } = req.body
		const userID = uuidv4()
		const hashedPassword = await bcrypt.hash(password, 10)
		const token = serverClient.createToken(userID)
		res.json({firstName, username, token, hashedPassword, userID})
	} catch (error) {
		res.json(error)
	}
})

app.post("/login", async (req, res) => {
	try {
		const {username, password} = req.body
		const {users} = await serverClient.queryUsers({ name: username })
		if (users.length === 0)
			return res.json({message: "user not found"})
		console.log(users.length)
		const passwordMatch  = bcrypt.compare(password, users[0].hashedPassword)
		const token = serverClient.createToken(users[0].id)
		if (passwordMatch)
		{
			 res.json({
				token,
				username,
				firstName: users[0].firstName,
				userID: users[0].userID,
			})
		}
	} catch (error){
		res.json({error})
	}
})

app.listen(3001, () => {
	console.log("hi from 3001")
})

