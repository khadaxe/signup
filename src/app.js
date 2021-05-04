require('dotenv').config();
const express=require('express');
const path=require('path');
const app=express();
const hbs=require('hbs');
const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken');
const cookieParser=require('cookie-parser');


require("./db/conn");
const Register=require("./models/registers");
const auth=require("./middleware/auth")
// const { urlencoded } = require('express');

const port= process.env.PORT || 3000
// const static_path_join=path.join(__dirname,'../public')
const views_path=path.join(__dirname,'../templates/views');
const partials_path=path.join(__dirname,'../templates/partials');

app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(cookieParser());

// app.use(express.static(static_path_join));
app.set("view engine","hbs");
app.set("views",views_path);
hbs.registerPartials(partials_path);


app.get('/',(req,res)=>{
    res.render("index");
});

app.get('/register',(req,res)=>{
    res.render("register");
});

app.get('/login',(req,res)=>{
    res.render("login");
});

app.get('/secret',auth,(req,res)=>{
    res.render("secret");
});

app.get('/logout',auth,async(req,res)=>{
    try{
      console.log(req.user);

      req.user.tokens=req.user.tokens.filter((currentElement)=>{
         return currentElement.token !== req.token
      })

      res.clearCookie("jwt");
      console.log("Logout successfully")
      await req.user.save();
      res.render("login");
    }
    catch(err){
        console.log(err);
    }
});


app.post('/register',async(req,res)=>{
  try{
   const email=req.body.email;
   const existingUser= await Register.findOne({email});
    
   if(existingUser)
     return res.status(400).send("An account of this email already exists");
   
   const password=req.body.password;
   const confirmpassword=req.body.cpassword;
   if(password===confirmpassword){
       const RegisteredEmp=new Register({
        email:req.body.email,
        password:password,
        confirmpassword:confirmpassword    
       });
    //   const token=await RegisteredEmp.generateAuthToken();
    //   console.log(token);
      
    //   res.cookie("jwt",token,{
    //       expires:new Date(Date.now()+30000),
    //       httpOnly:true
    //   });

      const registered= await RegisteredEmp.save();
      console.log(registered);
      res.render("login");
   }
   else 
   {
       res.send("Password Not matching")
   }
  }
  catch(err){
      console.log(err);
  }
 

});

app.post("/login",async(req,res)=>{
  try{
   const email=req.body.email;
   const password=req.body.password;
   const SignUser=await Register.findOne({email});
   const isMatch=await bcrypt.compare(password,SignUser.password);

   const token=await SignUser.generateAuthToken();
   console.log(token);
   
   res.cookie("jwt",token,
   {
    expires:new Date(Date.now()+600000),
    httpOnly:true
   });
 
  

   if(isMatch)
   {
       res.render('index');
   }
   else {
       res.send("Invalid Login credentials")
   }

  }
  catch(err){
      console.log("Invalid Login details" + err);
  }

  

})



// const bcrypt=require('bcryptjs');
// const secureFunct=async (password)=>{
//   const hashed=await bcrypt.hash(password,10);
//   console.log(hashed);
//   const passwordmatch=await bcrypt.compare("Khadka1234",hashed);
//   console.log(passwordmatch);
// }
// secureFunct("Khadka123");







app.listen(port,()=>{
    console.log(`Server is running at ${port}`);
})