const express = require('express')
const {
    httpGetAllLaunches ,
    httpPostNewLaunch,
    httpAbortLunchByhId
} = require ('./launches.controller')


const launchesRouter = express.Router()

launchesRouter.get('/' ,httpGetAllLaunches );
launchesRouter.post('/' ,httpPostNewLaunch );
launchesRouter.delete('/:id' ,httpAbortLunchByhId );

module.exports={
launchesRouter
}