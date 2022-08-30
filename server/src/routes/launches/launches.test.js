const request = require("supertest");
const app = require("../../app");
const {mongoConnect}= require('../../../service/mongo')
const {mongoDisConnect}= require('../../../service/mongo')



describe('Lanches API ', ()=>{
beforeAll(async ()=>{
  await mongoConnect()
});
// afterAll(async ()=>{
//   await mongoDisConnect()
// });

describe("Test GET /launches", () => {
  test("it should respond with 200 success", async () => {
    const response = await request(app).get("/launches").expect(200);
  });
});

describe("Test Post /launch ", () => {
  const completeLaunchData = {
    mission: "majd192",
    rocket: "Majd Expermintal IS1",
    target: "Kepler-62 f",
    launchDate: "june 6, 2088",
  };

  const launchDataWithoutDate = {
    mission: "majd192",
    rocket: "Majd Expermintal IS1",
    target: "Kepler-62 f",
  };
  const launchDataWithInvalidDate = {
    mission: "majd192",
    rocket: "Majd Expermintal IS1",
    target: "Kepler-185 f",
    launchDate: "majd",
  };

  test("it should respond with 201 success", async () => {
    const response = await request(app)
      .post("/launches")
      .expect(201)
      .send(completeLaunchData)
      .expect("Content-Type", /json/);

    const requestDate = new Date(completeLaunchData.launchDate).valueOf;
    const responseDate = new Date(launchDataWithoutDate).valueOf;
    expect(requestDate).toBe(responseDate);

    expect(response.body).toMatchObject(launchDataWithoutDate);
  });
  test("it should catch missing properties", async () => {
    const response = await request(app)
      .post("/launches")
      .send(launchDataWithoutDate)
      .expect("Content-Type", /json/)

      .expect(400);
    expect(response.body).toStrictEqual({
      error: "missing requiered launch property",
    });
  });

  test("it should catch invalid dates", async () => {
    const response = await request(app)
      .post("/launches")
      .send(launchDataWithInvalidDate)
      .expect("Content-Type", /json/)
      .expect(400);
    expect(response.body).toStrictEqual({
      error: "invalid launch date",
    });
  });
});


})
