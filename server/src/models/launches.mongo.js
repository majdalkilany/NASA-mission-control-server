const mongoose = require('mongoose')

launchesSchema = new mongoose.Schema({

    flightNumber : {
        type : Number,
        required : true
    },
    mission: {
        type :String ,
        required : true
    },
    rocket :{
        type : String ,
        required : true

    },
    launchDate : {
        required :true , 
        type : Date
        
    },
    target : {
        type :String ,
        required : true 

    },
    customers :[String],
    upcoming :{
        required : true,
        type :Boolean ,
        default : true
    },
    sucess : {
        type :Boolean ,
        required : true ,
        default : true
    }
})
module.exports = mongoose.model('launch',launchesSchema)