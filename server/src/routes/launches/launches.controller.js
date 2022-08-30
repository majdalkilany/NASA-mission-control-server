const {
    getAllLaunches ,
    //  addNewLaunch ,
    scheduleNewLaunch,
     existsLaunchWithId,
     abortedLaunchById
    } = require('../../models/launches.model')

    const {
        getPagination
    }= require('../../../service/query')

async function httpGetAllLaunches (req,res){
    const  {skip , limit } = getPagination(req.query)


   
    return res.status(200).json(await  getAllLaunches(skip , limit))
}


async function httpPostNewLaunch (req,res){

const launch = req.body
console.log(launch)
if (!launch.launchDate || !launch.mission || !launch.target || !launch.rocket){

    return res.status(400).json({
        error: 'missing requiered launch property'
    })
}

launch.launchDate= new Date(launch.launchDate);
if (isNaN(launch.launchDate)){
    return res.status(400).json({
        error: 'invalid launch date'
    })
}

await scheduleNewLaunch(launch)
res.status(201).json(launch)

}

async function  httpAbortLunchByhId (req,res){
const launchId = +req.params.id
const exists = await existsLaunchWithId(launchId)
if (!exists){
    return res.status(404).json({
        error :"launch not found"
    })
    
}
    const aborted = abortedLaunchById(launchId)

    if (!aborted){
        return res.status(400).json({
            error :' launch not aborted'
        })
    }
    
    return res.status(200).json({
        ok :true
    })


}


module.exports={
    httpGetAllLaunches,
    httpPostNewLaunch,
    httpAbortLunchByhId
}