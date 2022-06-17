const supertest = require('supertest');
const request = supertest('http://localhost:3000');

describe('Express Route Test', function () {
	it('user login successfully', async () => {
		return request
			.post('/login')
			.send({username: 'Ming', password: "p@ss" })
			.expect('Content-Type', /json/)
			.expect(200)
			.then(res => {
				expect(res.body.username).toBe('Ming');
			});
	});

	it('user login failed', async () => {
		return request
			.post('/login')
			.send({username: 'Ming', password: "pass" })
			.expect('Content-Type', /text/)
			.expect(400)
			.then(res => {
				expect(res.text).toBe('Invalid username or password');
			});
	})

	it('user register', async () => {
		return request
			.post('/register')
			.send({
				username: 'Ming2', 
				password: "p@ss", 
				phone: "123456",
				email:"ming@gmail.com",
				block: "A1", 
				role: "tenant"})
			.expect('Content-Type', /text/)
			.expect(200)
			.then(res => {
				expect(res.text).toBe('Register successfully');
			});
	});

	it('user register failed', async () => {
		return request
			.post('/register')
			.send({
				username: 'Ming', 
				password: "p@ss", 
				phone: "123456",
				email:"ming@gmail.com",
				block: "A1", 
				role: "tenant" })
			.expect('Content-Type', /text/)
			.expect(400)
			.then(res => {
				expect(res.text).toBe('Username already exists');
			});
	})

	it('admin register', async () => {
		return request
			.post('/admin/register')
			.send({
				admin_id: 'admin', 
				password: "password", 
				role: "admin"})
			.expect('Content-Type', /text/)
			.expect(200)
			.then(res => {
				expect(res.text).toBe('Admin register successfully');
			});
	});

	it('admin register failed', async () => {
		return request
			.post('/admin/register')
			.send({
				admin_id: 'admin1', 
				password: "password",
				role: "admin" })
			.expect('Content-Type', /text/)
			.expect(400)
			.then(res => {
				expect(res.text).toBe('Admin ID account already exists');
			});
	})

	it('admin login successfully', async () => {
		return request
			.post('/admin/login')
			.send({admin_id: 'admin1', password: "password" })
			.expect('Content-Type', /json/)
			.expect(200)
			.then(res => {
				expect(res.body.admin_id).toBe('admin1');
			});
	});

	it('admin login failed', async () => {
		return request
			.post('/admin/login')
			.send({admin_id: 'Ming', password: "pass" })
			.expect('Content-Type', /text/)
			.expect(400)
			.then(res => {
				expect(res.text).toBe('Invalid login');
			});
	})
	
	it('add visitor successful', async () => {
		return request
			.post('/visitor')
			.send({
				visitor: 'Visitor13', 
				car: "A 1082", 
				date: "18/06/2022", 
				tenant: "Ming", 
				block: "A2" })
			.expect('Content-Type', /json/)
			.expect(200)
			.then(res => {
				expect(res.body[0].visitor_name).toBe('Visitor13');
				expect(res.body[0].visitor_car_plate).toBe('A 1082');
				expect(res.body[0].visitation_date).toBe('18/06/2022');
				expect(res.body[0].tenant_name).toBe('Ming');
				expect(res.body[0].tenant_block).toBe('A2');
			});
	})

	it('add visitor failed', async () => {
		return request
			.post('/visitor')
			.send({
				visitor: 'Visitor2', 
				car: "DEF 2", 
				date: "18/06/2022", 
				tenant: "Ming2", 
				block: "A2" })
			.expect('Content-Type', /text/)
			.expect(400)
			.then(res => {
				expect(res.text).toBe('Visitor already exists');
			}
		);
	})

	it('update visitor successful', async () => {
		return request
			.patch('/visitor')
			.expect(200)
			.send({
				visitor: 'Visitor13',
				date: "18/06/2022",
				tenant: "Ming",
				newName: 'Visitor Updated',
				newCar: 'ABC 1282',
			})
			.expect('Content-Type', /json/)
			.then(res => {
				expect(res.body[0].visitor_name).toBe('Visitor Updated');
				expect(res.body[0].visitor_car_plate).toBe('ABC 1282');
			})
	})

	it('update visitor failed', async () => {
		return request
			.patch('/visitor')
			.expect(400)
			.send({
				visitor: 'Visitor',
				date: "18/06/2022",
				tenant: "Ming2",
				newName: 'Visitor Updated',
				newCar: 'ABC 1282',
			})
			.expect('Content-Type', /text/)
			.then(res => {
				expect(res.text).toBe('Visitor does not exist on that day');
			})
	})

	it('delete visitor successful', async () => {
		return request
			.delete('/visitor')
			.expect(200)
			.send({
				visitor: 'Visitor Updated',
				date: "18/06/2022",
				tenant: "Ming",
			})
			.expect('Content-Type', /text/)
			.then(res => {
				expect(res.text).toBe('Visitor deleted');
			})
	})

	it('delete visitor failed', async () => {
		return request
			.delete('/visitor')
			.expect(400)
			.send({
				visitor: 'Visitor',
				date: "18/06/2022",
				tenant: "Ming2",
			})
			.expect('Content-Type', /text/)
			.then(res => {
				expect(res.text).toBe('Visitor not found, unable to delete');
			})
	})

	it('reserve facility successful', async () => {
		return request
			.post('/facility')
			.expect(200)
			.send({
				facility: 'hall',
				date: "18/06/2022",
				startTime: "1000",
				endTime: "1400",
				block: "A1",})
			.expect('Content-Type', /json/)
			.then(res => {
				expect(res.body[0].facility).toBe('hall');
				expect(res.body[0].date).toBe('18/06/2022');
				expect(res.body[0].time[0]).toBe('1000');
				expect(res.body[0].time[1]).toBe('1400');
				expect(res.body[0].block).toBe('A1');})
	})

	it('reserve facility failed', async () => {
		return request
			.post('/facility')
			.expect(400)
			.send({
				facility: 'hall',
				date: "15/06/2022",
				startTime: "1000",
				endTime: "1200",
				block: "A1",})
			.expect('Content-Type', /text/)
			.then(res => {
				expect(res.text).toBe('Facility already reserved on that time');
			})
		})

	it('visitor show access successful', async () => {
		return request.get('/visitor/Visitor2')
			.expect(200)
			.expect('Content-Type', /json/)
			.then(res => {
				expect(res.body[0].visitor_name).toBe('Visitor2');
			})
	})

	it('visitor show access failed', async () => {
		return request.get('/visitor/Visitor22')
			.expect(400)
			.expect('Content-Type', /text/)
			.then(res => {
				expect(res.text).toBe('No visitor');
			})
	})
});