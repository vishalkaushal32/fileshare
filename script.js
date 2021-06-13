const File = require('./model/file');
const fs = require('fs');
const connectDb = require('./config/db')

connectDb();

async function fetchData(){
    const pastDate = new Date(Date.now() - (24 * 60 * 60 * 1000)) ;
    console.log(pastDate);

    const files=await File.find({createdAt: { $lt:pastDate }});
     if(files.length) {

        for (const file of files){
            try {
                fs.unlinkSync(file.path);
            await file.remove();

            console.log("success removed ", file.filename);
            } catch (error) {
                console.log("error while deleting file ", error.message);
            }
        }
        console.log("job done");


         
     }
  
}

fetchData().then(process.exit());