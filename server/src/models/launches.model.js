const axios = require("axios");
const { query } = require("express");
const { path, response } = require("../app");

const launchesDatabase = require("./launches.mongo");
const planets = require("./planets.mongo");

// const launches = new Map()

async function findLaunch (filter) {
    return await launchesDatabase.findOne(filter)
}


async function existsLaunchWithId(id) {
  return await findLaunch({
    flightNumber: id,
  });
}



// launches.set(launch.flightNumper , launch)

async function getLatestFlightNumber() {
  const latestLunchNumber = await launchesDatabase
    .findOne()
    .sort("-flightNumber");
  if (!latestLunchNumber) {
    return DEFAULT_FLIGHT_NUMBER;
  }
  return latestLunchNumber.flightNumber;
}

async function getAllLaunches(skip , limit) {
  return await launchesDatabase.find(
    {},
    {
      _id: 0,
      __V: 0,
    }

  )
  .sort({flightNumber:1})
  .skip(skip)
   .limit(limit)
}

async function scheduleNewLaunch(launch) {
     const planet = await planets.findOne({
        keplerName: launch.target,
      });
    
      if (!planet) {
        throw new Error("no match planet found!");
      }
  const newFlightNumber = (await getLatestFlightNumber()) + 1;

  const newLaunch = Object.assign(launch, {
    succes: true,
    upcoming: true,
    customers: ["majd", "nasa"],
    flightNumber: newFlightNumber,
  });
  savelaunch(newLaunch);
}

const SPACEX_API_URL = `https://api.spacexdata.com/v4/launches/query`;

async function loadLaunches() {
//   console.log("downloading data ");
  const response = await axios.post(SPACEX_API_URL, {
    query: {},
    option: {
      pagination: false,
      populate: [
        {
          path: "rocket",
          select: {
            name: 1,
          },
        },
        {
          path: "payloads",
          select: {
            customers: 1,
          },
        },
      ],
    },
  });

  const launchDocs = response.data.docs;
//   console.log(launchDocs);
  for (const launchDoc of launchDocs) {
    const payloads = launchDoc["payloads"];
    const customers = payloads.flatMap((payload) => {
      return payload["cuatomers"];
    });
    // console.log(customers, "12121");

    const launch = {
      flightNumber: launchDoc.flight_number,
      mission: launchDoc.name,
      rocket: launchDoc.rocket.name,
      launchDate: launchDoc.date_local,
      // target: "Kepler-62 f", // not applicable
      customers,
      upcoming: launchDoc.upcoming,
      succes: launchDoc.success,
    };
    // console.log(launch.flightNumber, launch.mission);
    savelaunch(launch)
  }
}

async function savelaunch(launch) {
  
  await launchesDatabase.updateOne(
    {
      flightNumber: launch.flightNumber,
    },
    launch,
    {
      upsert: true,
    }
  );
}

async function abortedLaunchById(id) {
//   console.log(id);
  const aborted = await launchesDatabase.updateOne(
    {
      flightNumber: id,
    },
    {
      upcoming: false,
      sucess: false,
    }
  );
  // console.log(aborted)
  // const aborted = launches.get(id)

  return aborted.modifiedCount === 1 && aborted.matchedCount === 1;
}

module.exports = {
  loadLaunches,
  getAllLaunches,
  scheduleNewLaunch,
  existsLaunchWithId,
  abortedLaunchById,
};
