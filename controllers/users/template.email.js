const { USER_MAIL } = require("../../config");

const templateEmail = (mailInfor) =>
  `<!DOCTYPE html>
<html lang="en">
<head>
    <title></title>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style>
        /* CLIENT-SPECIFIC STYLES */
        body,
        table,
        td,
        a {
            -webkit-text-size-adjust: 100%;
            -ms-text-size-adjust: 100%;
        }
        table,
        td {
            mso-table-lspace: 0pt;
            mso-table-rspace: 0pt;
        }
        img {
            -ms-interpolation-mode: bicubic;
        }
        /* RESET STYLES */
        img {
            border: 0;
            height: auto;
            line-height: 100%;
            outline: none;
            text-decoration: none;
        }
        table {
            border-collapse: collapse !important;
        }
        body {
            height: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
            width: 100% !important;
        }
    </style>
</head>
<body style="background-color: #ffffff; margin: 0 !important; padding: 0 !important;">
    <table border="0" cellpadding="0" cellspacing="0" width="100%" border-radius="#756af8">
        <tr>
            <td align="center" style="padding: 40px 40px 40px 40px;">
                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                    <tbody style="border: 1px solid #756af8; box-sizing: border-box; border-radius: 8px;">
                        <tr>
                            <td bgcolor="#ffffff" align="center" style="padding: 10px 30px 10px 30px; color: #181818; font-family: 'Montserrat', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;">
                                <a href= "mailto:${USER_MAIL}" style="margin: 0;"> (<span style="color: #82b5f0" >${USER_MAIL}
                            </td>
                        </tr>
                        <tr>
                            <td bgcolor="#ffffff" align="center" style="padding: 10px 30px 50px 30px; color: #181818; font-family: 'Montserrat', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;">
                                <p style="margin: 0; padding: 15px 25px; background-color: #499df3; width: fit-content; border-radius: 4px;">
                                  <a href="${mailInfor.url}" target="_blank" style="text-decoration: none; color: #ffffff;">Accept</a> <br />
                                </p>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
`;

module.exports = templateEmail;
