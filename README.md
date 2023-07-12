# nodemailer-imap-transfer
### 解决：
- 写邮件不能直接贴 html + css，不能写 markdown 的问题。
- 收邮件不能按照规则自动下载附件、自动保存邮件内容的问题。

### 实现：
- 发邮件是基于 SMTP 协议，收邮件是基于 POP3 或 IMAP 协议。
- 通过 nodemailer 发送了 html 的邮件，可以发送任何 html+css 的内容。
- 通过 imap 实现了邮件的搜索，然后用 mailparser 来做了内容解析，然后把邮件内容和附件做了下载。