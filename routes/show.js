const router=require('express').Router();
const File = require('../model/file');

router.get('/:uuid', async (req,res)=>{
    try {
        const file = await File.findOne({ uuid:req.params.uuid})

        if(!file){
            res.render('download',{error:"link has been expired"});

        }
        res.render('download',{
            uuid:file.uuid,
            filename:file.filename,
            filesize:file.filesize,
            downloadLink:`${process.env.APP_BASE_URL}/files/download/${file.uuid}`
        });
    } catch (error) {
            res.render('download',{error:"something went wrong"});
    }
   
})


module.exports=router;