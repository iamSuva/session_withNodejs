const express=require("express");
const cookieparse=require("cookie-parser");
const session=require("express-session");
const app=express();
const fs=require("fs");
const path=require("path");
app.use(express.urlencoded({extended:true}));

const userRoute=require("./routing/userroutes");

//for post request to encode data need parser
const oneday=1000*60*60*24;
app.use(cookieparse()); 
app.use(session({ //creation of session
    saveUninitialized:true,
    resave:false,  /// handle all request combinedly
    secret:"ey734f3u4bv374",
    cookie:{maxAge:oneday}
}));
app.use("/users",auth,userRoute);

//users/dashboard
//users/profile
//users/history
function auth(req,res,next)
{
    if(req.session.username)
    {
        next();
    }
    else{
        res.redirect("/");
    }
}
app.use(express.static("./public"));

// app.get("/dashboard.html",(req,res)=>{
//        res.redirect("/dashborad");
// })

app.get("/",(req,res)=>{
      if(req.session.username)
      {
        res.redirect("/users/dashboard");
      }
      else{
        res.sendFile(path.join(__dirname,"./public/login.html"));
      }
})
app.get("/logout",(req,res)=>{
    req.session.destroy();
    res.redirect("/login");
})
app.get("/login",(req,res)=>{
    
    //console.log(req.query);
    
    // res.send(`Welcome ${req.query.username}`);
    // res.sendFile(path.join(__dirname,'/public/login.html'));
   
    if(req.session.username)
    {
        res.redirect("/users/dashboard");
    }
    else{
        res.sendFile(path.join(__dirname,"./public/login.html"));
    }

})

// app.get("/dashboard",(req,res)=>{
//     if(req.session.username){

//         res.sendFile(__dirname+"/public/dashboard.html");
//     }
//     else{
//         res.redirect("/login");
//     }
// })
app.post("/signup",(req,res)=>{
    
    const reqdata=req.body;
   // console.log(reqdata);
    res.send("Sign up Successful!!");
      if(!fs.existsSync("user.txt"))
      {
        fs.writeFile("user.txt","",(err)=>{
             if(err)
             {
                console.log(err);
             }
             else
             console.log("file is created");
        })
      }
     /// console.log("after ..................")
     if(fs.existsSync("user.txt"))
     {
        console.log("file exist");
        let oldrecords;
        fs.readFile("user.txt","utf-8",(err,data)=>{
            if(data=="")
            {
              oldrecords=[];
                 
            }
            else{
                oldrecords=JSON.parse(data);

            }
         // console.log("old records: ",oldrecords);
          oldrecords.push(reqdata);
          console.log("new records:",oldrecords);
   
          fs.writeFile("users.txt",JSON.stringify(oldrecords),(err)=>{
            if(err)
            {
               console.log("errrr");
            }
          })
       })
     }
    
   
})

app.post("/login",(req,res)=>{

  
     const mydata=req.body;
   // console.log(mydata);
    // res.json(data);
    if(fs.existsSync("users.txt"))
    {
        fs.readFile("users.txt","utf-8",(err,data)=>{
            const records=JSON.parse(data);
          //  console.log(records);
          const finddata= records.filter((item)=>{
            
                if(item.username==mydata.username && item.password==mydata.password)
                {
                    return true;
                }
            })
          //  console.log(finddata);
      if(finddata.length==0)
      {
        //   res.send("Invalid user password");
        res.redirect("/login");
      }
      else{
       // res.send("welcome");
          req.session.username=req.body.username;
          res.redirect('/users/dashboard');
      }
    
    
      })
    }
    else{
        res.send("file not found found");
    }
      
     
    
    

})
app.listen(3000,(err)=>{
    console.log("listening to port 3000");
})