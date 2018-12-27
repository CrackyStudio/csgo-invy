const https = require('https');
const request = require('request');
const session = require('express-session');

class mainModel {
    static mainPage(req, res) {
        res.render('../views/main.ejs')
    }
    static steamAccountInfo(accountURL, res, req) {
        let options = {
          uri: `${accountURL}/inventory/json/730/2`,
          json: true
        }
        request(options, function (error, response, body) {
          req.session.object = body;
          res.redirect('dashboard')
        });
    }
}

module.exports = mainModel;