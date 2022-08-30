require('dotenv').config()
const http = require('http')


const app = require('./app')
const {mongoConnect} = require('../service/mongo')


const {loadLaunches} = require('./models/launches.model')
const {loadPlanetsData} = require('./models/planets.models')
const PORT = process.env.PORT || 8000;

const server = http.createServer(app)

async function startServer(){
    await mongoConnect()
    await loadLaunches()

    await loadPlanetsData();
    server.listen(PORT,()=>{
        console.log(PORT)
    })
}
startServer()