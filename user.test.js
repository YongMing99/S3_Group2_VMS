const MongoClient = require("mongodb").MongoClient;
const User = require("./user")

describe("User Account Management", () => {
	let client;
	beforeAll(async () => {
		client = await MongoClient.connect(
			"mongodb+srv://m001-student:m001-mongodb-basics@sandbox.4ai9y.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
			{ useNewUrlParser: true },
		);
		User.injectDB(client);
	})

	afterAll(async () => {
		await client.close();
	})

	test("New user registration", async () => {
		const res = await User.register("Ming3", "p@ss", "123456", "ming3@gmail.com", "A2", "tenant")
		expect(res[0].username).toBe("Ming3");
		expect(res[0].password).toBe("195f19b835efe9f0b7b4e276ef1a8515");
		expect(res[0].phone).toBe("123456");
		expect(res[0].email).toBe("ming3@gmail.com");
		expect(res[0].block).toBe("A2");
		expect(res[0].role).toBe("tenant");
	})

	test("Duplicate username", async () => {
		const res = await User.register("Ming", "p@ss")
		expect(res).toBe("Username already exists");
	})

	test("User login invalid username", async () => {
		const res = await User.login("Meng", "p@ss")
		expect(res).toBe("Invalid username");
	})

	test("User login invalid password", async () => {
		const res = await User.login("Ming", "wrongPass")
		expect(res).toBe("Invalid password") 
	})

	test("User login successfully", async () => {
		const res = await User.login("Ming", "p@ss")
		expect(res[0].username).toBe("Ming");
		expect(res[0].password).toBe("195f19b835efe9f0b7b4e276ef1a8515");
		expect(res[0].phone).toBe("123456");
		expect(res[0].email).toBe("ming@gmail.com");
		expect(res[0].block).toBe("A1");
		expect(res[0].role).toBe("tenant");
	})

	// test("User update information", async()=>{
	// 	const res = await User.update("Ming", "p@ss", "new_phone.no", "new_email@gmail.com")
	// 	expect(res[0].username).toBe("Ming");
	// 	expect(res[0].password).toBe("195f19b835efe9f0b7b4e276ef1a8515");
	// 	expect(res[0].phone).toBe("new_phone.no");
	// 	expect(res[0].email).toBe("new_email@gmail.com");
	// })

	test("Add visitor successfully", async()=>{
		const res = await User.addVisitor("Visitor3", "ABC 23", "18/06/2022", "Ming2", "A2")
		expect(res[0].visitor_name).toBe("Visitor3");
		expect(res[0].visitor_car_plate).toBe("ABC 23");
		expect(res[0].visitation_date).toBe("18/06/2022");
	})

	test("Failed to add visitor", async()=>{
		const res = await User.addVisitor("Visitor1", "ABC 1", "15/06/2022", "Ming2", "A2")
		expect(res).toBe("Visitor already exists on that day")
	})

	// test("Update visitor successfully", async()=>{
	// 	const res = await User.updateVisitor("Visitor1", "15/06/2022", "Ming", "New_Visitor", "ABC 2")
	// 	expect(res[0].visitor_name).toBe("New_Visitor");
	// 	expect(res[0].visitor_car_plate).toBe("ABC 2");
	// 	expect(res[0].visitation_date).toBe("15/06/2022");
	// })

	test("Failed to update visitor", async()=>{
		const res = await User.updateVisitor("Annoymous", "15/06/2022", "Ming", "New_Visitor", "ABC 2")
		expect(res).toBe("Visitor does not exist on that day")
	})

	test ("Delete visitor successfully", async()=>{
		const res = await User.deleteVisitor("Visitor1", "15/06/2022", "Ming2")
		expect(res).toBe("Visitor deleted")
	})

	test("Failed to delete visitor", async()=>{
		const res = await User.deleteVisitor("Visitor5", "15/06/2022", "Ming")
		expect(res).toBe("Visitor does not exist on that day")
	})

	test("Reserve facility successfully", async()=>{
		const res = await User.reserve("hall", "15/06/2022", "1600", "1800", "A1")
		expect(res[0].facility).toBe("hall");
		expect(res[0].date).toBe("15/06/2022");
		expect(res[0].time[0]).toBe("1800");
		expect(res[0].time[1]).toBe("2000");
		expect(res[0].block).toBe("A1");
	})

	test("Failed to reserve facility", async()=>{
		const res = await User.reserve("hall", "15/06/2022","1800","2000", "A1")
		expect(res).toBe("Facility is already reserved")
	})
});