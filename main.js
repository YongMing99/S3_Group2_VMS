const MongoClient = require("mongodb").MongoClient;
const User = require("./user");
const Visitor = require("./visitor")

MongoClient.connect(
	"mongodb+srv://m001-student:m001-mongodb-basics@sandbox.4ai9y.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
	{ useNewUrlParser: true },
).catch(err => {
	console.error(err.stack)
	process.exit(1)
}).then(async client => {
	console.log('Connected to MongoDB');
	User.injectDB(client);
	Visitor.injectDB(client);
	Admin.injectDB(client);
})

const express = require('express');
const { raw } = require("express");
const jwt = require('jsonwebtoken');
const Admin = require("./admin");
const app = express()
const port = process.env.PORT || 3000

const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const option = {
	definition: {
		openapi: '3.0.3',
		info:{
			title: 'Condominium Visitor Management API',
			version: '1.0.0',
		},
		components:{
			securitySchemes:{
				jwt:{
					type: 'http',
					scheme: 'bearer',
					in: "header",
					bearerFormat: 'JWT'
				}
			},
		security:[{
			"jwt": []
		}]
		}
	},
	apis: ['./main.js']
};
const swaggerSpec = swaggerJsdoc(option);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

function generateAccessToken(payload){
	return jwt.sign(payload, 'secret', { expiresIn: '1d' });
}

/**
 * @swagger
 * /login:
 *   post:
 *     tags: [User Authentication]
 *     description: User login to the system
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: User login successfully
 *       400:
 *         description: User invalid login
 */

app.post('/login', async (req, res) => {
	const user = await User.login(req.body.username, req.body.password);
	if (user == "Invalid username" || user == "Invalid password") {
		res.status(400).send("Invalid username or password")
	}
	else{
		res.status(200).json({
			_id: user[0]._id,
			username: user[0].username,
			token: generateAccessToken({username: user[0].username, role: user[0].role})
		})
	}
})

/**
 * @swagger
 * /register:
 *   post:
 *     tags: [User Authentication]
 *     description: User register to the system
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *               phone:
 *                 type: string
 *               email:
 *                 type: string
 *               block:
 *                 type: string
 *               role:
 *                 type: string
 *     responses:
 *       200:
 *         description: User register successfully
 *       400:
 *         description: Username already exists
 */


app.post('/register', async (req, res) => {
	const user = await User.register(
		req.body.username, 
		req.body.password, 
		req.body.phone, 
		req.body.email, 
		req.body.block, 
		req.body.role);
	if (user == "Username already exists") {
		res.status(400).send("Username already exists")
	}
	else{
		res.status(200).send("Register successfully")
	}
})

/**
 * @swagger
 * /admin/register:
 *   post:
 *     tags: [Admin Authentication]
 *     description: Admin register to the system
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               admin_id:
 *                 type: string
 *               password:
 *                 type: string
 *               role:
 *                 type: string
 *     responses:
 *       200:
 *         description: Admin register successfully
 *       400:
 *         description: Admin id already exists
 */

app.post('/admin/register', async (req, res) => {
	const admin = await Admin.register(
		req.body.admin_id,
		req.body.password,)
	if (admin == "Admin ID account already exists") {
		res.status(400).send("Admin ID account already exists")
	}
	else{
		res.status(200).send("Admin register successfully")
	}
})

/**
 * @swagger
 * /admin/login:
 *   post:
 *     tags: [Admin Authentication]
 *     description: Admin login to the system
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               admin_id:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Admin login successfully
 *       400:
 *         description: Admin invalid login
 */

app.post('/admin/login', async (req, res) => {
	const admin = await Admin.login(req.body.admin_id, req.body.password);
	if (admin == "Invalid login") {
		res.status(400).send("Invalid login")
	}
	else{
		res.status(200).json({
			_id: admin[0]._id,
			admin_id: admin[0].admin_id,
			token: generateAccessToken({admin_id: admin[0].admin_id, role: admin[0].role})
		})
	}
})

/**
 * @swagger
 * /visitor/{id}:
 *   get:
 *     summary: View Visitor Information
 *     tags: [Visitor's Features]
 *     description: Get visitor information
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Visitor ID
 *     responses:
 *       200:
 *         description: Show visitor information
 *       400:
 *         description: Visitor ID not found
 */

 app.get('/visitor/:id', async (req, res) => {
	const {id} = req.params;
	const visitor = await Visitor.showAccess(id);
	if (visitor == "Visitor not found") {
		res.status(400).send("No visitor")
	}
	else{
		res.status(200).json(visitor)
	}
})

/**
 * @swagger
 * /visitor/health:
 *   post:
 *     tags: [Visitor's Features]
 *     description: Visitor health check
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               health:
 *                 type: string
 *               vaccination:
 *                 type: string
 *     responses:
 *       200:
 *         description: Visitor health check successfully
 *       400:
 *         description: Visitor health check failed
 */

 app.post('/visitor/health', async (req, res) => {
	const visitor = await Visitor.addHealth(
		req.body.name,
		req.body.health,
		req.body.vaccination);
	if (visitor == "Visitor not found") {
		res.status(400).send("No visitor")
	}
	else{
		res.status(200).send("Health information added successfully")
	}
})

app.use((req, res, next) => {
	const authHeader = req.headers['authorization']
	const token = authHeader && authHeader.split(' ')[1]

	if (token == null) return res.sendStatus(401)

	jwt.verify(token, 'secret', (err, user)=>{
		if(err) return res.sendStatus(403)
		req.user = user
		next()
	})
});

/**
 * @swagger
 * /visitor:
 *   post:
 *     security:
 *       - jwt: []
 *     summary: Add Visitor
 *     tags: [User's Features]
 *     description: Add visitor information
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               visitor:
 *                 type: string
 *               car:
 *                 type: string
 *               date:
 *                 type: string
 *               tenant:
 *                 type: string
 *               block:
 *                 type: string
 *     responses:
 *       200:
 *         description: Visitor information added
 *       400:
 *         description: Visitor information already exists
 */

app.post('/visitor', async (req, res) => {
	if(req.user.role == 'tenant'){
		const user = await User.addVisitor(
			req.body.visitor, 
			req.body.car, 
			req.body.date, 
			req.body.tenant, 
			req.body.block);
		if(user == 'Visitor already exists on that day'){
			res.status(400).send('Visitor already exists')
		}
		else{
			res.status(200).json(user)
		}
	}
	else{
		res.status(400).send("You are not authorized")
	}
})

/**
 * @swagger
 * /visitor:
 *   patch:
 *     security:
 *       - jwt: []
 *     summary: Update Visitor Information
 *     tags: [User's Features]
 *     description: Update visitor information
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               visitor:
 *                 type: string
 *               date:
 *                 type: string
 *               tenant:
 *                 type: string
 *               newName:
 *                 type: string
 *               newCar:
 *                 type: string
 *     responses:
 *       200:
 *         description: Visitor information updated
 *       400:
 *         description: Visitor information not found
 */

app.patch('/visitor', async (req, res) => {
	if(req.user.role == 'tenant' || req.user.role == 'admin'){
		const user = await User.updateVisitor(req.body.visitor, req.body.date, req.body.tenant, req.body.newName, req.body.newCar);
		if(user == 'Visitor does not exist on that day')
		{
			res.status(400).send('Visitor does not exist on that day')
		}
		else{
			res.status(200).json(user)
		}
	}
})

/**
 * @swagger
 * /visitor:
 *   delete:
 *     security:
 *       - jwt: []
 *     summary: Delete Visitor
 *     tags: [User's Features]
 *     description: Delete visitor information
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               visitor:
 *                 type: string
 *               date:
 *                 type: string
 *               tenant:
 *                 type: string
 *     responses:
 *       200:
 *         description: Visitor information deleted
 *       400:
 *         description: Visitor information not found
 */

app.delete('/visitor', async (req, res) => {
	if(req.user.role == 'tenant' || req.user.role == 'admin'){
		const user = await User.deleteVisitor(
			req.body.visitor, req.body.date, req.body.tenant)
		if(user == 'Visitor does not exist on that day')
		{
			res.status(400).send('Visitor not found, unable to delete')
		}
		else{
			res.status(200).send('Visitor deleted')
		}
	}
})

/**
 * @swagger
 * /facility:
 *   post:
 *     security:
 *     - jwt: []
 *     summary: Reserve Facility
 *     tags: [User's Features]
 *     description: Reserve facility
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               facility:
 *                 type: string
 *               date:
 *                 type: string
 *               startTime:
 *                 type: string
 *               endTime:
 *                 type: string
 *               block:
 *                 type: string
 *     responses:
 *       200:
 *         description: Facility reserved
 *       400:
 *         description: Facility already reserved
 */

app.post('/facility', async (req, res) => {
	if(req.user.role == 'tenant' || req.user.role == 'admin'){
		const user = await User.reserve(
			req.body.facility,
			req.body.date,
			req.body.startTime,
			req.body.endTime,
			req.body.block,
		)
		if(user == 'Facility is already reserved'){
			res.status(400).send('Facility already reserved on that time')
		}
		else{
			res.status(200).json(user)
		}
	}
})

/**
 * @swagger
 * /admin/visitor/{id}:
 *   get:
 *     security:
 *       - jwt: []
 *     summary: View Visitor Information
 *     tags: [Admin's Features]
 *     description: Get visitor information
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Visitor ID
 *     responses:
 *       200:
 *         description: Show visitor information
 *       400:
 *         description: Visitor ID not found
 */

 app.get('/admin/visitor/:id', async (req, res) => {
	if (req.user.role == "admin") {
		const {id} = req.params;
		const visitor = await Visitor.showAccess(id);
		if (visitor == "Visitor not found") {
			res.status(400).send("No visitor")
		}
		else{
			res.status(200).json(visitor)
		}
	}
})

/**
 * @swagger
 * /admin/visitor:
 *   delete:
 *     security:
 *       - jwt: []
 *     summary: Delete visitors
 *     tags: [Admin's Features]
 *     description: Delete visitors
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               visitor_name:
 *                 type: string
 *     responses:
 *       200:
 *         description: Visitor deleted
 *       400:
 *         description: Visitor not found
 */

app.delete('/admin/visitor', async (req, res) => {
	if(req.user.role == 'admin'){
		const admin = await Admin.removeVisitor(req.body.visitor_name);
		if(admin == 'No visitor found'){
			res.status(400).send('No visitor found')
		}
		else{
			res.status(200).send('Visitor removed')
		}
	}
})

/**
 * @swagger
 * /admin/tenant:
 *   post:
 *     security:
 *       - jwt: []
 *     summary: Add Tenant
 *     tags: [Admin's Features]
 *     description: Add tenant
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               password:
 *                 type: string
 *               phone:
 *                 type: string
 *               email:
 *                 type: string
 *               block:
 *                 type: string
 *               role:
 *                 type: string
 *               added_by:
 *                 type: string
 *     responses:
 *       200:
 *         description: Tenant added
 *       400:
 *         description: Tenant already exists
 */

app.post('/admin/tenant', async (req, res) => {
	if(req.user.role == 'admin'){
		const admin = await Admin.addTenant(
			req.body.name,
			req.body.password,
			req.body.phone,
			req.body.email,
			req.body.block,
			req.body.role,
			req.body.added_by
			);
		if(admin == 'Tenant already exists'){
			res.status(400).send('Tenant already exists')
		}
		else{
			res.status(200).json(admin)
		}
	}})

/**
 * @swagger
 * /admin/tenant:
 *   delete:
 *     security:
 *       - jwt: []
 *     summary: Delete Tenant
 *     tags: [Admin's Features]
 *     description: Delete tenant
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       200:
 *         description: Tenant deleted
 *       400:
 *         description: Tenant not found
 */

app.delete('/admin/tenant', async (req, res) => {
	if(req.user.role == 'admin'){
		const admin = await Admin.removeTenant(req.body.name);
		if(admin == 'No tenant found'){
			res.status(400).send('No tenant found')
		}
		else{
			res.status(200).send('Tenant removed')
		}
	}
})


app.listen(port, () => {
	console.log(`Example app listening on port ${port}`)
})
