const {getAllplanets} = require("../../models/planets.models");


async function httpGetAllplanets  (req, res) {
  return res.status(200).json(await getAllplanets());
}

module.exports = { 
  httpGetAllplanets 
};
