const mongoose = require('mongoose')

const MONGO_URL = process.env.MONGO_URL


mongoose.connection.once('open', ()=>{
    console.log('MongoDB connection ready!')
})


mongoose.connection.on('error',(err)=>{
    console.error(err);
})

async function mongoConnect (){
    return await mongoose.connect(MONGO_URL)

}

async function mongoDisConnect (){
    return await mongoose.disconnect(MONGO_URL)

}

module.exports = {
    mongoConnect ,
    mongoDisConnect
}