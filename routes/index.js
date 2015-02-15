var express = require('express');
var router = express.Router();
var mandrill = require('mandrill-api/mandrill');

router.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

router.post('/contact', function(req, res, next) {
  mandrill_client = new mandrill.Mandrill(req.app.conf.MANDRILL_KEY);

  var msg = {
    text: req.body.message,
    from_email: req.body.email,
    subject: ['Website contact:', req.body.subject].join(' '),
    to: [{ email: req.app.conf.SEND_MAIL_TO }]
  };

  mandrill_client.messages.send({
    message: msg,
    async: false,
    ip_pool: 'Main Poo;'
  }, function(result) {
    console.log(result);
    res.json({ status: 'ok' });
  }, function(err) {
    console.error(err);
    res.status(500).json({ status: 'failure' });
  });
});

module.exports = router;
