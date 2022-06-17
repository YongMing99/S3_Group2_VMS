const MongoClient = require("mongodb").MongoClient;
const Visitor = require("./visitor")

describe("Visitor Account Management", () => {
    let client;
	beforeAll(async () => {
		client = await MongoClient.connect(
			"mongodb+srv://m001-student:m001-mongodb-basics@sandbox.4ai9y.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
			{ useNewUrlParser: true },
		);
		Visitor.injectDB(client);
	})

	afterAll(async () => {
		await client.close();
	})

    test("visitor update health successfully", async () => {
        const res = await Visitor.addHealth("Visitor2", "healthy", "vaccinated")
        expect(res[0].visitor_name).toBe("Visitor2");
        expect(res[0].health_status).toBe("healthy");
        expect(res[0].vaccination).toBe("vaccinated");
    })

    test("visitor update health unsuccessfully", async () => {
        const res = await Visitor.addHealth("Visitor123", "healthy", "vaccinated")
        expect(res).toBe("Visitor not found");
    })

    test("show access", async()=>{
        const res = await Visitor.showAccess("Visitor2")
        expect(res[0].visitor_name).toBe("Visitor2");
        expect(res[0].visitor_car_plate).toBe("DEF 2");
        expect(res[0].visitation_date).toBe("18/06/2022");
        expect(res[0].tenant_name).toBe("Ming2");
        expect(res[0].tenant_block).toBe("A2");
        expect(res[0].health_status).toBe("healthy");
        expect(res[0].vaccination).toBe("vaccinated");
    })

    test("no access", async()=>{
        const res = await Visitor.showAccess("Visitor123")
        expect(res).toBe("Visitor not found");
    })
});