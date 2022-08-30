const mongoose =require('mongoose')

planetShcema = new mongoose.Schema({
    keplerName : {
        type : String , 
        required : true
    }
}) 
module.exports = mongoose.model('planet', planetShcema);