const md5 = require('md5');

let users;
let visitors;
let facilities;
// User / Tenant's Features
class User {
	static async injectDB(conn) {
		users = await conn.db("assignment_g2").collection("users")
		visitors = await conn.db("assignment_g2").collection("visitor")
		facilities = await conn.db("assignment_g2").collection("facilities")
	}

	/**
	 * @remarks
	 * This method is not implemented yet. To register a new user, you need to call this method.
	 * 
	 * @param {*} username 
	 * @param {*} password 
	 * @param {*} phone 
	 */
	// User register
	static async register(username, password, phone, email, block, role) {
		var username_check = await users.find({username: username}).count() // check existance of username

		if (username_check>0) {
			return "Username already exists"
		}
		else{
			var hash_password = await md5(password) // hash password with md5
			var user = await users.insertOne(
				{
					username: username, 
					password: hash_password, 
					phone: phone, 
					email: email, 
					block: block, 
					role: role
				})
			return users.find({username: username}).toArray()
		}
	}
	
	//User login
	static async login(username, user_password) {
		var username_count = await users.find({username: username}).count();
		if (username_count > 0) {
			var password_check = await md5(user_password)
			var password_check_db = await users.find({username: username}).toArray()
			// compare hashed password
			if (password_check_db[0].password == password_check) {
				return users.find({username: username}).toArray()
			}
			else{
				return "Invalid password"
			}
		}
		else{
			return "Invalid username"
		}
	}

	// static async update(username, user_password, phone, email) {
	// 	var update = await users.updateOne({username: username}, {$set: {phone: phone, email: email}})
	// 	return users.find({username: username}).toArray()
	// }

	// User add visitor
	static async addVisitor(visitor_name, visitor_car, visit_date, tenant_name, tenant_block) {
		var visitor_check = await visitors.find({visitor_name: visitor_name, visitation_date:visit_date}).count()
		if (visitor_check>0) {
			return "Visitor already exists on that day"
		}
		else{
			var visitor = await visitors.insertOne(
				{
					visitor_name: visitor_name, 
					visitor_car_plate: visitor_car, 
					visitation_date: visit_date, 
					tenant_name: tenant_name,
					tenant_block: tenant_block
				})
			return visitors.find({visitor_name: visitor_name}).toArray()
		}
	}
	
	//User update visitor's details
	static async updateVisitor(visitor_name, visit_date, tenant_name, new_name, new_car) {
		var visitor_check = await visitors.find({visitor_name: visitor_name, visitation_date:visit_date, tenant_name:tenant_name}).count()
		if (visitor_check>0) {
			var visitor = await visitors.updateOne(
				{
					visitor_name: visitor_name, 
					visitation_date:visit_date, 
					tenant_name:tenant_name
				}, 
				{$set: 
					{
						visitor_name: new_name, 
						visitor_car_plate: new_car
					}
				})
			return visitors.find({visitor_name: new_name, tenant_name:tenant_name}).toArray()
		}
		else{
			return "Visitor does not exist on that day"
		}
	}

	//User delete visitor
	static async deleteVisitor(visitor_name, visit_date, tenant_name) {
		var visitor_check = await visitors.find({visitor_name: visitor_name, visitation_date:visit_date, tenant_name:tenant_name}).count()
		if (visitor_check>0) {
			var visitor = await visitors.deleteOne(
				{
					visitor_name: visitor_name, 
					visitation_date:visit_date, 
					tenant_name:tenant_name
				})
			return "Visitor deleted"
		}
		else{
			return "Visitor does not exist on that day"
		}
	}

	//Visitor reserve facility
	static async reserve(facility, date, start_time, end_time, block){
		var time_check = await facilities.find({
			facility: facility,
			date: date,
			time: {$gt: start_time, $lt: end_time},
		}).count()
		if (time_check>0) {
			return "Facility is already reserved"
		}
		else{
			var booking = await facilities.insertOne({
				facility: facility,
				date: date,
				time: [start_time, end_time],
				block: block
			})
			return facilities.find({facility: facility, date: date, block: block}).toArray()
		}
	}
}

module.exports = User;
