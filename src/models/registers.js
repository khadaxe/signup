const mongoose=require('mongoose');
const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken');

const employeeSchema=new mongoose.Schema({
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        // required:true
    },
    confirmpassword:{
        type:String,
        // required:true
    },
    tokens:[{
        token:{
            type:String,
            required:true
        }
    }]
});

employeeSchema.methods.generateAuthToken=async function(){
    try{
   
    const token=jwt.sign({_id:this._id.toString()},process.env.SECRET_KEY);
    this.tokens=this.tokens.concat({token});
    await this.save();
    return token;
    }
    catch(err){
        res.send("Error");
        console.log(err);
    }
}



employeeSchema.pre("save",async function(next){
   
   
  if(this.isModified("password")){ 
   this.password=await bcrypt.hash(this.password,10);
   this.confirmpassword=await bcrypt.hash(this.confirmpassword,10);
  }
   
    next();

});


const Register=new mongoose.model("Register",employeeSchema);





module.exports=Register;