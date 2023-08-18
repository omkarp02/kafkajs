import nodemailer from "nodemailer";

export default async function sendEmail({ msg, email }) {
  const transporter = nodemailer.createTransport({
    port: 465,
    host: "smtp.gmail.com",
    auth: {
      user: "botemailhello@gmail.com",
      pass: "ocmdweubvurualtl",
    },
    secure: true,
  });

  const mailData = {
    from: "botemailhello@gmail.com",
    to: email,
    html: msg,
  };

  const resp = await transporter.sendMail(mailData) 
  return resp;
}





