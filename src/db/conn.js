const mongoose=require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.DB,{
    useNewUrlParser:true,
    useUnifiedTopology:true,
    useCreateIndex:true
}).then(()=>{
    console.log("Connection successful");
}).catch((err)=>{
    console.log("Connection error"+ err);
})