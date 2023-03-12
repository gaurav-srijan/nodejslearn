const nodemailer = require("nodemailer");


const sendNodeMailer = async (userData) =>{
    var transporter = nodemailer.createTransport({
        host: "sandbox.smtp.mailtrap.io",
        port: 2525,
        auth: {
          user: "25fb869f3372e2",
          pass: "653869c03f1210"
        }
      });
  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: '"DevCamper 👻" <Devcamper.io>', // sender address
    to: userData.email, // list of receivers
    subject: userData.subject, // Subject line
    text: userData.message, // plain text body
    html: "<b>Hello world?</b>", // html body
  });

  
}
 module.exports = sendNodeMailer