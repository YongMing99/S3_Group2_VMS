const supertest = require('supertest');
const Visitor = require('./visitor');
const request = supertest('http://localhost:3000');
const token_user = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Ik1pbmciLCJyb2xlIjoidGVuYW50IiwiaWF0IjoxNjU1MTg0MDkxLCJleHAiOjE2NTc3NzYwOTF9.Ya6s4vhWSqAIfiitCyBsv3EFC9XsNEVRSncZkpwOeZA';
const token_admin = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhZG1pbl9pZCI6ImFkbWluMSIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTY1NTIwMDU2OCwiZXhwIjoxNjU3NzkyNTY4fQ.HVYelT1jdlpnnwEe7IMLcNGVpld_zEdYUvvfxyW03_Y'

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
				username: 'NewUser', 
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
				admin_id: 'admin10', 
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
			.set('authorization', 'Bearer '+ token_user)
			.send({
				visitor: 'Visitor13', 
				car: "A 1082", 
				date: "18/06/2022", 
				tenant: "Ming", 
				block: "A2", })
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
			.set('authorization', 'Bearer '+ token_user)
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
			.set('authorization', 'Bearer '+ token_user)
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
			.set('authorization', 'Bearer '+ token_user)
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
			.set('authorization', 'Bearer '+ token_user)
			.expect(200)
			.send({
				visitor: 'Visitor3',
				date: "18/06/2022",
				tenant: "Ming2"
			})
			.expect('Content-Type', /text/)
			.then(res => {
				expect(res.text).toBe('Visitor deleted');
			})
	})

	it('delete visitor failed', async () => {
		return request
			.delete('/visitor')
			.set('authorization', 'Bearer '+ token_user)
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
			.set('authorization', 'Bearer '+ token_user)
			.expect(200)
			.send({
				facility: 'court',
				date: "18/06/2022",
				startTime: "1000",
				endTime: "1400",
				block: "A1",})
			.expect('Content-Type', /json/)
			.then(res => {
				expect(res.body[0].facility).toBe('court');
				expect(res.body[0].date).toBe('18/06/2022');
				expect(res.body[0].time[0]).toBe('1000');
				expect(res.body[0].time[1]).toBe('1400');
				expect(res.body[0].block).toBe('A1');})
	})

	it('reserve facility failed', async () => {
		return request
			.post('/facility')
			.set('authorization', 'Bearer '+ token_user)
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

	it('visitor add health status successful', async()=>{
		return request
		    .post('/visitor/health')
			.expect(200)
			.send({
				name: "Visitor2",
				health: "healthy",
				vaccination: "vaccinated"
			})
			.expect('Content-Type', /text/)
			.then(res=>{
				expect(res.text).toBe('Health information added successfully');
			})
	})

	it('visitor add health status fail', async()=>{
		return request
		    .post('/visitor/health')
			.expect(400)
			.send({
				name: "Visitor",
				health: "healthy",
				vaccination: "vaccinated"
			})
			.expect('Content-Type', /text/)
			.then(res=>{
				expect(res.text).toBe('No visitor');
			})
	})

	it('admin view visitor successful', async () => {
		return request.get('/admin/visitor/Visitor2')
			.expect(200)
			.set('authorization', 'Bearer '+ token_admin)
			.expect('Content-Type', /json/)
			.then(res => {
				expect(res.body[0].visitor_name).toBe('Visitor2');
			})
	})

	it('admin view visitor failed', async () => {
		return request.get('/visitor/Visitor22')
			.expect(400)
			.set('authorization', 'Bearer '+ token_admin)
			.expect('Content-Type', /text/)
			.then(res => {
				expect(res.text).toBe('No visitor');
			})
	})

	it('admin delete visitor successful', async () => {
		return request
			.delete('/admin/visitor')
			.set('authorization', 'Bearer '+ token_admin)
			.expect(200)
			.send({
				visitor_name: 'Visitor Updated'
			})
			.expect('Content-Type', /text/)
			.then(res => {
				expect(res.text).toBe('Visitor removed');
			})
	})

	it('admin delete visitor fail', async () => {
		return request
			.delete('/admin/visitor')
			.set('authorization', 'Bearer '+ token_admin)
			.expect(400)
			.send({
				visitor_name: 'Visitor 0'
			})
			.expect('Content-Type', /text/)
			.then(res => {
				expect(res.text).toBe('No visitor found');
			})
	})

	it('admin add tenant sucessful', async () => {
		return request
			.post('/admin/tenant')
			.set('authorization', 'Bearer '+ token_admin)
			.expect(200)
			.send({
				name: 'Ben',
				password: 'p@ss',
				phone:'123345',
				email:'ben@yahoo.com',
				block: 'B2',
				role:'tenant',
				added_by: 'admin2'})
			.expect('Content-Type', /json/)
			.then(res => {
				expect(res.body[0].username).toBe('Ben');})
	})

	it('admin add tenant fail', async () => {
		return request
			.post('/admin/tenant')
			.set('authorization', 'Bearer '+ token_admin)
			.expect(400)
			.send({
				name: 'Ming',
				password: 'p@ss',
				phone:'123345',
				email:'ben@yahoo.com',
				block: 'B2',
				role:'tenant',
				added_by: 'admin2'})
			.expect('Content-Type', /text/)
			.then(res => {
				expect(res.text).toBe('Tenant already exists');})
	})

	it('admin delete tenant successful', async () => {
		return request
			.delete('/admin/tenant')
			.set('authorization', 'Bearer '+ token_admin)
			.expect(200)
			.send({
				name: 'Ben'})
			.expect('Content-Type', /text/)
			.then(res => {
				expect(res.text).toBe('Tenant removed');}
			)
	})

	it('admin delete tenant fail', async () => {
		return request
			.delete('/admin/tenant')
			.set('authorization', 'Bearer '+ token_admin)
			.expect(400)
			.send({
				name: 'Ben'})
			.expect('Content-Type', /text/)
			.then(res => {
				expect(res.text).toBe('No tenant found');}
			)
	})
});