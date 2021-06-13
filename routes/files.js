const router = require('express').Router();
const multer = require('multer');
const path = require('path');
const {v4 : uuid4} = require('uuid');

const File = require("../model/file")

let storage = multer.diskStorage({
    destination: (req, file , cb) => cb(null,'uploads/'),
    filename : (req, file, cb)=>{
        const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`;
        cb(null,uniqueName);
    }
});

let upload = multer({
    storage,
    limit : {fileSize:1000000*100}
}).single('myFile');

router.post('/',(req,res)=>{
  
   

    //store file

    upload(req,res,async (err)=>{

          // validate request
        if(!req.file){
            res.json({error:"all fields are required"})
        }

        if(err){
            return res.status(500).send({err:err.message})
        }

         //database storeage
         const file = new File({
             filename : req.file.filename,
             uuid : uuid4(),
             path:req.file.path,
             size : req.file.size


         });

         const response = await file.save();

        return res.json({file:`${process.env.APP_BASE_URL}/files/${response.uuid}`});
    });

   


    //send response link

})


router.post('/send', async (req,res)=>{

    //validate req
    const {uuid, emailTo, emailFrom} = req.body;

    if( !uuid || !emailTo || !emailFrom){
       return res.status(422).send({error:"all fields are reqd"});

    }

    // get data from db

    const file = await File.findOne({uuid:uuid})
    if(file.sender){
        return res.status(422).send({error:"email sent already"});

    }
    file.sender=emailFrom;
    file.receiver = emailTo;

    const response = await file.save();
    // console.log(response);
    // send email
    const sendMail = require('../services/emailService');

    // console.log(sendMail)
     await  sendMail({
        from: emailFrom,
        to: emailTo,
        subject : "in share file sharing",
        text : `${emailFrom} shared file with you`,
        html : require('../services/emailTemplate')({
            emailFrom : emailFrom,
            downloadLink : `${process.env.APP_BASE_URL}/files/${file.uuid}`,
            size : parseInt(file.size/1000) + 'KB',
            expires :'24 hours'
        })

    }).then( ()=>{
        return res.status(200).send({success:"email sent"})
    }).catch((err)=>{
        return res.status(404).send({status:"email not sent",error:err.message })
    });



    // return res.status(200).send({success:"email hahahahah"});
// 
    

  
});


module.exports=router;