const nodemailer = require('nodemailer')


module.exports = async function sendMail({from, to, subject, text, html}){

    let transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: false,
        auth :{
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASSWORD
        }

    });

    let info = await transporter.sendMail({
        from: `inshare <${from}>`,
        to: to,
        subject: subject,
        text: text,
        html:html


    })//.catch(err=>{throw err})
    
    
    // console.log("hello line 30", info);
    // .then((resolve, reject)=>{
    //     reject.send("rejected");
    // }
    // );

 
    
    // transporter.verify(function(error, success) {
    //     if (error) {
    //       console.log(error);
    //     } else {
    //       console.log("Server is ready to take our messages");
    //     }
    //   });
}

