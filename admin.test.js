const MongoClient = require("mongodb").MongoClient;
const Admin = require("./admin")

describe("Visitor Account Management", () => {
    let client;
    beforeAll(async () => {
		client = await MongoClient.connect(
			"mongodb+srv://m001-student:m001-mongodb-basics@sandbox.4ai9y.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
			{ useNewUrlParser: true },
		);
		Admin.injectDB(client);
	})

	afterAll(async () => {
		await client.close();
	})

    test("New admin registration", async () => {
		const res = await Admin.register("admin3", "password", "admin")
		expect(res[0].admin_id).toBe("admin3");
        expect(res[0].password).toBe("5f4dcc3b5aa765d61d8327deb882cf99");
        expect(res[0].role).toBe("admin");
	})

    test("Duplicate admin id", async () => {
        const res = await Admin.register("admin1", "password", "admin")
        expect(res).toBe("Admin ID account already exists");
    })

    test("Admin login successfully", async () => {
		const res = await Admin.login("admin1", "password")
		expect(res[0].admin_id).toBe("admin1");
		expect(res[0].password).toBe("5f4dcc3b5aa765d61d8327deb882cf99");
		expect(res[0].role).toBe("admin");
	})

    test("Admin invalid login", async () => {
		const res = await Admin.login("admin", "p@ss")
		expect(res).toBe("Invalid login");
	})

    test("Admin view visitor", async () => {
        const res = await Admin.viewVisitors("Visitor2")
        expect(res[0].visitor_name).toBe("Visitor2");
        expect(res[0].visitor_car_plate).toBe("ABC 1");
        expect(res[0].visitation_date).toBe("18/06/2022");
        expect(res[0].tenant_name).toBe("Ming2");
        expect(res[0].tenant_block).toBe("A2");
        expect(res[0].health_status).toBe("healthy");
        expect(res[0].vaccination).toBe("vaccinated");
    })

    test("Admin view visitor not found", async () => {
        const res = await Admin.viewVisitors("Visitor5")
        expect(res).toBe("No visitor found");
    })

    test("Admin remove visitor successfully", async () => {
        const res = await Admin.removeVisitor("Visitor_delete")
        expect(res).toBe("Visitor removed");
    })

    test("Admin remove visitor unsuccessfully", async () => {
        const res = await Admin.removeVisitor("Visitor5")
        expect(res).toBe("No visitor found");
    })

    test("Admin add tenant successful", async () => {
		const res = await Admin.addTenant("Ben", "p@ss", "123456", "ben@gmail.com", "F4", "tenant", "admin1")
		expect(res[0].username).toBe("Ben");
		expect(res[0].password).toBe("195f19b835efe9f0b7b4e276ef1a8515");
		expect(res[0].phone).toBe("123456");
		expect(res[0].email).toBe("ben@gmail.com");
		expect(res[0].block).toBe("F4");
		expect(res[0].role).toBe("tenant");
        expect(res[0].added_by).toBe("admin1");
	})

    test("Admin add tenant unsuccessful", async () => {
        const res = await Admin.addTenant("Ben", "p@ss", "123456", "ben@gmail.com", "F4", "tenant", "admin1")
        expect(res).toBe("Tenant already exists");
    })

    test("Admin remove tenant successful", async () => {
        const res = await Admin.removeTenant("Ben")
        expect(res).toBe("Tenant removed");
    })

    test("Admin remove tenant unsuccessful", async () => {
        const res = await Admin.removeTenant("Ben11")
        expect(res).toBe("No tenant found");
    })
})