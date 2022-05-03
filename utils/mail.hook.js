var mailer = require("nodemailer");
const { USER_MAIL, USER_PASS } = require("../config");
const templateEmail = require("../controllers/users/template.email");

const sendMail = async (mailInfor) => {
  var transporter = mailer.createTransport({
    service: "gmail",
    auth: {
      user: USER_MAIL,
      pass: USER_PASS,
    },
  });
  var mailOptions = {
    from: USER_MAIL,
    to: mailInfor.email,
    subject: "Accept Account",
    html: templateEmail(mailInfor),
  };

  transporter.sendMail(mailOptions, (err, infor) => {
    if (err) {
      console.log(err);
    } else {
      console.log(infor);
    }
  });
};

module.exports = sendMail;
