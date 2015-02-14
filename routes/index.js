var express = require('express');
var router = express.Router();
var nodemailer = require('nodemailer');
var sesTransport = require('nodemailer-ses-transport');

router.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

/* GET home page. */

router.post('/contact', function(req, res, next) {
  console.log(req.app.conf);
  var transport = nodemailer.createTransport(sesTransport({
    accessKeyId: req.app.conf.AWS_ACCESS_KEY,
    secretAccessKey: req.app.conf.AWS_SECRET_KEY,
    rateLimit: 1 // do not send more than 1 message in a second
  }));

  var mailOptions = {
    from: "noreply@raphaelcruzeiro.com",
    to: 'raphaelcruzeiro@raphaelcruzeiro.com', // list of receivers
    subject: req.body.subject, // Subject line
    text: req.body.message, // plaintext body
    replyTo: req.body.email
  };

  console.log(mailOptions);

  transport.sendMail(mailOptions, function(error, response) {
    if (error) {
      console.error('Failed sending the email:\n' + JSON.stringify(error));
      res.status(500).json({ status: 'failure' });
    } else {
      console.log('Sent email.');
      res.json({ status: 'ok' });
    }
  });
});

module.exports = router;
