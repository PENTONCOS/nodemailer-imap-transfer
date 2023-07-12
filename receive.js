const { MailParser } = require('mailparser');
const fs = require('fs');
const path = require('path');
const Imap = require('imap');

const imap = new Imap({
  user: 'xx@qq.com',
  password: '你的授权码',
  host: 'imap.qq.com',
  port: 993,
  tls: true
});

imap.once('ready', () => {
  imap.openBox('INBOX', true, (err) => {
    // ['SEEN'] 是查询已读的邮件
    // ['SINCE', '某个日期'] 是查询从这个日期以来的邮件
    // 更多查看：https://www.npmjs.com/package/imap
    imap.search([['SEEN'], ['SINCE', new Date('2023-07-12 19:00:00').toLocaleString()]], (err, results) => {
      if (!err) {
        handleResults(results);
      } else {
        throw err;
      }
    });
  });
});


function handleResults(results) {
  // 这里用 imap.fetch 来请求这些 id 的内容
  imap.fetch(results, {
    bodies: '', // bodies 为 '': 查询 header + body
  }).on('message', (msg) => {
    const mailparser = new MailParser(); // 解析邮件内容的插件

    msg.on('body', (stream) => {

      // 处理下 body 的内容，把结果保存到 info 对象里
      const info = {};
      stream.pipe(mailparser);
      mailparser.on("headers", (headers) => {
        info.theme = headers.get('subject');
        info.form = headers.get('from').value[0].address;
        info.mailName = headers.get('from').value[0].name;
        info.to = headers.get('to').value[0].address;
        info.datatime = headers.get('date').toLocaleString();
      });

      mailparser.on("data", (data) => {
        if (data.type === 'text') {
          info.html = data.html;
          info.text = data.text;

          // 把 html 的内容保存到本地文件里
          const filePath = path.join(__dirname, 'mails', info.theme + '.html');
          // 以邮件主题为文件名
          fs.writeFileSync(filePath, info.html || info.text)

          console.log(info);
        }
        // 如果有附件，就写到 files 目录下
        if (data.type === 'attachment') {
          const filePath = path.join(__dirname, 'files', data.filename);
          const ws = fs.createWriteStream(filePath);
          data.content.pipe(ws);
        }
      });
    });
  });
}

imap.connect();