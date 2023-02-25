const request = require("supertest");
const { app } = require("../app.js");
const mongoose = require("mongoose");

require("dotenv").config();

beforeAll(async () => {
  await mongoose.connect(process.env.MONGODB_URI);
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe("Location Testing", () => {
  describe("GET /api/locations", () => {
    it("should return all locations", async () => {
      await request(app)
        .get("/api/locations")
        .expect(200)
        .then(({ body }) => {
          body.locations.forEach((location) => {
            expect(location).toEqual(
              expect.objectContaining({
                _id: expect.any(String),
                coordinates: expect.any(String),
                name: expect.any(String),
              })
            );
          });
        });
    });
  });
  describe("GET /api/location", () => {
    test("should return details for one specfic location", async () => {
      await request(app)
        .get("/api/rome")
        .expect(200)
        .then(({ body }) => {
          body.location.forEach((slocation) => {
            expect(slocation).toEqual(
              expect.objectContaining({
                _id: expect.any(String),
                coordinates: expect.any(String),
                name: expect.any(String),
              })
            );
          });
        });
    });
  });
  describe("GET /api/:locations/comments", () => {
    test("should return comments for a given location ", async () => {
      await request(app)
        .get("/api/Eiffel Tower/comments")
        .expect(200)
        .then(({ body }) => {
          body.comments.forEach((location) => {
            expect(location).toEqual(
              expect.objectContaining({
                _id: expect.any(String),
                body: expect.any(String),
                hasVoted: expect.any(Array),
                images: expect.any(Array),
                locationId: expect.any(String),
                userId: expect.any(String),
              })
            );
          });
        });
    });
  });
  describe("POST /api/locations", () => {
    it("should return a status code of 201", async () => {
      await request(app)
        .post("/api/locations")
        .send({
          name: "t678e!!!etrett!!!!!",
          coordinates: "4453.53°N 2.2245°W",
        })
        .expect(201);
    });
    it("should return a status code of 400 for invalid body", async () => {
      await request(app)
        .post("/api/locations")
        .send({ test: "t678e!!!!!!", test: "4453.53°N 2.2245°W" })
        .expect(400);
    });
    it("should return a status code", async () => {
      await request(app)
        .post("/api/locations")
        .send({ test: "t678e!!!!!!", test: "4453.53°N 2.2245°W" })
        .expect(400);
    });
  });
  describe("DELETE /api/locations/:location", () => {
    test("should delete any given location", async () => {
      await request(app).delete("/api/locations/te!!!!!!!!").expect(204);
    });
  });
});
describe("User Testing", () => {
  describe("GET /api/user", () => {
    it("should return specfic user data", async () => {
      await request(app)
        .get("/api/users/Alex")
        .then(({ body }) => {
          expect(typeof body.userData._id).toBe("string");
          expect(typeof body.userData.name).toBe("string");
          expect(typeof body.userData.email).toBe("string");
          expect(typeof body.userData.password).toBe("string");
          expect(typeof body.userData.profile_picture).toBe("string");
          expect(Array.isArray(body.userData.bucket_list)).toBe(true);
        });
    });
  });
  describe("GET /api/:user/list", () => {
    it("should return bucket list for a user ", async () => {
      await request(app)
        .get("/api/users/Alex/list")
        .then(({ body }) => {
          expect(typeof body.userList[0]._id).toBe("string");
          expect(typeof body.userList[0].name).toBe("string");
          expect(typeof body.userList[0].coordinates).toBe("string");
        });
    });
  });
  describe("POST & DELETE /api/users", () => {
    it("should return a status code of 201", async () => {
      await request(app)
        .delete("/api/users/tOFLO8e!!!etrett!!!!!")
        .then(async () => {
          await request(app)
            .post("/api/users")
            .send({
              name: "tOFLO8e!!!etrett!!!!!",
              password: "JBFA",
              email: "t678e!Ff!!!!!",
              profile_picture: "profile_picture",
            })
            .expect(201)
            .then((response) => {
              expect(response.request._data).toEqual({
                name: "tOFLO8e!!!etrett!!!!!",
                password: "JBFA",
                email: "t678e!Ff!!!!!",
                profile_picture: "profile_picture",
              });
            });
        });
    });
  });
});
