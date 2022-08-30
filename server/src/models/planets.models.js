const fs = require("fs");
const path = require("path");

const planets = require('./planets.mongo')

const { rejects } = require("assert");

const { resolve } = require("path");

const { parse } = require("csv-parse");
const habitablePlanets = [];
parse();

function isHabitablePlanet(planet) {
  return (
    planet["koi_disposition"] === "CONFIRMED" &&
    planet["koi_insol"] > 0.36 &&
    planet["koi_insol"] < 1.11 &&
    planet["koi_prad"] < 1.6
  );
}

function loadPlanetsData() {
  return new Promise((resolve, reject) => {
    fs.createReadStream(
      path.join(__dirname, "..", "..", "data", "kepler-data.csv")
    )
      .pipe(
        parse({
          comment: "#",
          columns: true,
        })
      )
      .on("data", async(data) => {
        if (isHabitablePlanet(data)) {
          habitablePlanets.push(data);
          savePlanets(data)
          
        }
      })
      .on("error", (err) => {
        console.log(err);
        reject(err);
      })
      .on("end", async() => {
        const countPlanetsFound = (await getAllplanets()).length
        console.log("all planets on the database " +countPlanetsFound)
        resolve();
      });
  });
}

async function getAllplanets() {

  return await planets.find({});
}

async function savePlanets(planet){
  try{
    await planets.updateOne({
      keplerName : planet.kepler_name,
    },{
      keplerName : planet.kepler_name,
  },{
    upsert : true,
  })
  }catch(err){
    console.log(err)
  }
  
}

module.exports = {
  loadPlanetsData,
  getAllplanets,
};
