const express = require('express');
const helmet = require('helmet');
const app = express();
app.use(helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'none'"],
      styleSrc: ["'self'", "https://fonts.googleapis.com"],
    },
  }));

const MongoClient = require('mongodb').MongoClient; 
const uri = "mongodb://localhost:27017/mydb";
MongoClient.connect(uri,(err,db)=>{
    if(err){
        console.log(err);
        process.exit(1);
    }

    const collection = db.collection('users');
});


app.post('/Signup_Page', (req,res)=>{
    const {fullName, address, contactNumber, password, email} = req.body;

    collection.insertOne({email,password},(err,result)=>{
        if(err){
            console.log(err);
            return res.status(500).send('error saving user');
        }
        return res.status(200).send('user saved');
    }
    );
}
);


app.listen(3000,()=>{
    console.log('listening on port 3000');
});



