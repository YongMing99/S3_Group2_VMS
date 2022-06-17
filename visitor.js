let users;
let visitors;
let facilities;

class Visitor{
    static async injectDB(conn) {
		users = await conn.db("assignment_g2").collection("users")
		visitors = await conn.db("assignment_g2").collection("visitor")
		facilities = await conn.db("assignment_g2").collection("facilities")
	}

    static async addHealth(name, health_status, vaccination){
        const visitor = await visitors.find({visitor_name: name}).count()
        if(visitor > 0){
            visitors.updateOne({visitor_name: name}, {$set: {health_status: health_status, vaccination: vaccination}})
            return visitors.find({visitor_name: name}).toArray()
        }
        else{
            return "Visitor not found"
        }
    }

    static async showAccess(name){
        const visitor = await visitors.find({visitor_name: name}).count()
        if(visitor > 0){
            return visitors.find({visitor_name: name}).toArray()
        }
        else{
            return "Visitor not found"
        }
    }
}

module.exports = Visitor;