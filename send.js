const nodemailer = require("nodemailer");
const fs = require("fs");

const transporter = nodemailer.createTransport({
  host: "smtp.qq.com",
  port: 587,
  secure: false,
  auth: {
    user: 'xxxxx@qq.com',
    pass: '你的授权码'
  },
});

async function main() {
  const info = await transporter.sendMail({
    from: '"jiapandong" <xxxx@qq.com>',
    to: "xxxx@xx.com",
    subject: "测试邮件",
    // text: "xxxxx"
    // html: "<h1>测试邮件</h1>",
    html: fs.readFileSync('./test.html'),
  });

  console.log("邮件发送成功：", info.messageId);
}

main().catch(console.error);
