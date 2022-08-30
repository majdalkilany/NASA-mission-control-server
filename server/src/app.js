const express = require('express')
const cors =require('cors')
const path = require('path')
const morgan =require('morgan')


const {api} = require('./routes/api')

const app = express()
app.use(express.json())

// ================================routs========================================



app.use(cors({
    origin:'http://localhost:3000'
}))
app.use(morgan('combined'))
app.use(express.json())
// ================================routs========================================
app.use(express.static(path.join(__dirname,'..','public')))


// ====================================Routersmiddleware=================================
app.use('/v1',api)


app.get('/*',(req,res)=>{
    res.sendFile(path.join(__dirname,'..','public','index.html',));
})





module.exports =app