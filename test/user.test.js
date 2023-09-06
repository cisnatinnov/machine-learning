const app = require('../app')
const request = require("supertest");

describe("Permission", () => {
  let token;
  beforeAll(async () => {
    let user = {
      email: "coba@gmail.com",
      password: "Coba123!!"
    }
    let response = await request(app).post("/api/v1/auth/checkpassword")
    .set("Content-Type", "application/json")
    .send(user);

    token = `Bearer ${response.body.data.token}`;
  })
  describe("User CRUD", () => {
    test("success read", async () => {
      let response = await request(app)
      .get('/api/v1/user')
      .set("Authorization", token);

      let data = response.body.data.data
      expect(response.status).toBe(200);
      expect(response.body.status).toBe(200);
      expect(response.body.message).toStrictEqual(`User data found ${data.length}`);
    })
    describe("User Create", () => {
      test("success create", async () => {  
        let user = {
          email: "try@gmail.com",
          username: "try",
          password: "Coba123!!",
          confirmPassword: "Coba123!!"
        }
        let response = await request(app)
        .post('/api/v1/user')
        .set("Authorization", token)
        .send(user);
  
        expect(response.status).toBe(200);
        expect(response.body.status).toBe(200);
        expect(response.body.message).toStrictEqual(`User successfuly inserted`);
      })
  
      test("failed create (Email exist)", async () => {   
        let user = {
          email: "coba@gmail.com",
          username: "coba",
          password: "Coba123!!",
          confirmPassword: "Coba123!!"
        }
        let response = await request(app)
        .post('/api/v1/user')
        .set("Authorization", token)
        .send(user);
  
        expect(response.status).toBe(401);
        expect(response.body.status).toBe(401);
        expect(response.body.message).toStrictEqual(`Email ${user.email} already registered`);
      })
  
      test("failed create (Username exist)", async () => {   
        let user = {
          email: "try1@gmail.com",
          username: "coba",
          password: "Coba123!!",
          confirmPassword: "Coba123!!"
        }
        let response = await request(app)
        .post('/api/v1/user')
        .set("Authorization", token)
        .send(user);
  
        expect(response.status).toBe(401);
        expect(response.body.status).toBe(401);
        expect(response.body.message).toStrictEqual(`Username ${user.username} already registered`);
      })
  
      test("failed create (Email not valid)", async () => {   
        let user = {
          email: "try",
          username: "try",
          password: "Coba123!!",
          confirmPassword: "Coba123!!"
        }
        let response = await request(app)
        .post('/api/v1/user')
        .set("Authorization", token)
        .send(user);
  
        expect(response.status).toBe(401);
        expect(response.body.status).toBe(401);
        expect(response.body.message).toStrictEqual(`Email ${user.email} Invalid email format`);
      })
  
      test("failed create (Password not valid)", async () => {   
        let user = {
          email: "try@gmail.com",
          username: "try",
          password: "coba123!!",
          confirmPassword: "coba123!!"
        }
        let response = await request(app)
        .post('/api/v1/user')
        .set("Authorization", token)
        .send(user);
  
        expect(response.status).toBe(401);
        expect(response.body.status).toBe(401);
        expect(response.body.message).toStrictEqual('Please use minimum 8 characters, at least 1 uppercase, 1 lowercase, 1 number and 1 special character!');
      })
    })
    describe("User Update", () => {
      test("success update", async () => {
        let user = {
          user_id: "54dcc52f-cc9a-47c0-a4bc-688e03e6f3a9",
          email: "coba@gmail.com",
          username: "coba"
        }
        let response = await request(app)
        .put('/api/v1/user')
        .set("Authorization", token)
        .send(user);

        expect(response.status).toBe(200);
        expect(response.body.status).toBe(200);
        expect(response.body.message).toStrictEqual(`User successfuly updated`);
      })

      test("failed update (Email not valid)", async () => {
        let user = {
          user_id: "54dcc52f-cc9a-47c0-a4bc-688e03e6f3a9",
          email: "coba",
          username: "coba"
        }
        let response = await request(app)
        .put('/api/v1/user')
        .set("Authorization", token)
        .send(user);

        expect(response.status).toBe(401);
        expect(response.body.status).toBe(401);
        expect(response.body.message).toStrictEqual(`Email ${user.email} Invalid email format`);
      })
    })
    describe("User Change Password", () => {
      test("success change password", async () => {
        let user = {
          user_id: "54dcc52f-cc9a-47c0-a4bc-688e03e6f3a9",
          email: "coba@gmail.com",
          password: "Coba123!!",
          changePassword: "Coba123!!",
        }
        let response = await request(app)
        .put('/api/v1/user/password')
        .set("Authorization", token)
        .send(user);

        expect(response.status).toBe(200);
        expect(response.body.status).toBe(200);
        expect(response.body.message).toStrictEqual(`User successfuly updated`);
      })

      test("failed change password (Email not valid)", async () => {   
        let user = {
          user_id: "54dcc52f-cc9a-47c0-a4bc-688e03e6f3a9",
          email: "coba",
          password: "Coba123!!",
          changePassword: "Coba123!!",
        }
        let response = await request(app)
        .put('/api/v1/user')
        .set("Authorization", token)
        .send(user);
  
        expect(response.status).toBe(401);
        expect(response.body.status).toBe(401);
        expect(response.body.message).toStrictEqual(`Email ${user.email} Invalid email format`);
      })
  
      test("failed change password (Password not valid)", async () => {   
        let user = {
          user_id: "54dcc52f-cc9a-47c0-a4bc-688e03e6f3a9",
          email: "coba@gmail.com",
          password: "coba123!!",
          changePassword: "coba123!!",
        }
        let response = await request(app)
        .put('/api/v1/user')
        .set("Authorization", token)
        .send(user);
  
        expect(response.status).toBe(401);
        expect(response.body.status).toBe(401);
        expect(response.body.message).toStrictEqual('Please use minimum 8 characters, at least 1 uppercase, 1 lowercase, 1 number and 1 special character!');
      })
    })
    describe("User Soft Delete", () => {
      test("success soft delete", async () => {
        let user = {
          user_id: "54dcc52f-cc9a-47c0-a4bc-688e03e6f3a9"
        }
        let response = await request(app)
        .put('/api/v1/user/delete')
        .set("Authorization", token)
        .send(user);

        expect(response.status).toBe(200);
        expect(response.body.status).toBe(200);
        expect(response.body.message).toStrictEqual(`User successfully deleted`);
      })
    })
    describe("User Delete", () => {
      test("success delete", async () => {
        let user = {
          user_id: "54dcc52f-cc9a-47c0-a4bc-688e03e6f3a9"
        }
        let response = await request(app)
        .delete('/api/v1/user')
        .set("Authorization", token)
        .send(user);

        expect(response.status).toBe(200);
        expect(response.body.status).toBe(200);
        expect(response.body.message).toStrictEqual(`User successfully deleted`);
      })
    })
  })
})