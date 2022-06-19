const md5 = require('md5');
let users;
let visitors;
let facilities;
let admins;

// Admin / Management's Features
class Admin{
    static async injectDB(conn) {
		users = await conn.db("assignment_g2").collection("users")
		visitors = await conn.db("assignment_g2").collection("visitor")
		facilities = await conn.db("assignment_g2").collection("facilities")
        admins = await conn.db("assignment_g2").collection("admin")
	}
    // Admin registration
    static async register(admin_id, password, role) {
		var admin_check = await admins.find({admin_id: admin_id}).count()
		if (admin_check>0) {
			return "Admin ID account already exists"
		}
		else{
			var hash_password = await md5(password)
			var user = await admins.insertOne(
				{
					admin_id: admin_id, 
					password: hash_password, 
                    role: role
				})
			return admins.find({admin_id: admin_id}).toArray()
		}
	}
    // Admin login
    static async login(admin_id, password) {
		var admin_check = await admins.find({admin_id: admin_id}).count();
		if (admin_check > 0) {
			var password_check = await md5(password)
			var password_check_db = await admins.find({admin_id: admin_id}).toArray()
			if (password_check_db[0].password == password_check) {
				return admins.find({admin_id: admin_id}).toArray()
			}
			else{
				return "Invalid login"
			}
		}
		else{
			return "Invalid login"
		}
	}
    // Admin view specific visitor
    static async viewVisitors(name) {
        var visitor_check = await visitors.find({visitor_name: name}).count();
        if (visitor_check > 0) {
            return visitors.find({visitor_name: name}).toArray()
        }
        else{
            return "No visitor found"
        }
    }
    // Admin remove specific visitor
    static async removeVisitor(name){
        var visitor_check = await visitors.find({visitor_name: name}).count();
        if (visitor_check > 0) {
            await visitors.deleteOne({visitor_name: name})
            return ("Visitor removed")
        }
        else{
            return "No visitor found"
        }
    }
    // Admin add tenant / user
    static async addTenant(username, password, phone, email, block, role, admin_id){
        var username_check = await users.find({username: username}).count()
        if (username_check>0) {
            return "Tenant already exists"
        }
        else{
            var hash_password = await md5(password)
            var user = await users.insertOne(
                {
                    username: username, 
                    password: hash_password, 
                    phone: phone, 
                    email: email, 
                    block: block, 
                    role: role,
                    added_by: admin_id
                })
            return users.find({username: username}).toArray()
        }
    }
    // Admin delete tenant / user
    static async removeTenant(username){
        var username_check = await users.find({username: username}).count()
        if (username_check > 0) {
            await users.deleteOne({username: username})
            return "Tenant removed"
        }
        else{
            return "No tenant found"
        }
    }

}

module.exports = Admin;
