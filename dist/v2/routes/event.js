'use strict';

var _jsonwebtoken = require('jsonwebtoken');

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

var _joi = require('joi');

var _joi2 = _interopRequireDefault(_joi);

var _expressJoiValidator = require('express-joi-validator');

var _expressJoiValidator2 = _interopRequireDefault(_expressJoiValidator);

var _controllers = require('../controllers');

var _config = require('../config/config.json');

var _idroute = require('../validate/idroute');

var _idroute2 = _interopRequireDefault(_idroute);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var auth = function auth(req, res, next) {
  var token = req.headers['x-access-token'];
  if (!token) {
    return res.status(401).json({ auth: false, message: 'No token provided' });
  }
  return _jsonwebtoken2.default.verify(token, _config.tksecret, function (error, decoded) {
    if (error) {
      return res.status(500).json({ auth: false, message: 'Failed to authenticate token.' });
    }
    if (decoded.role !== 2) {
      return res.status(401).json({ auth: false, message: 'Not authorized' });
    }
    req.user = decoded;
    return next();
  });
};

module.exports = function (app) {
  app.post('/events', auth, _controllers.event.createEvent);
  app.delete('/events/:id', (0, _expressJoiValidator2.default)(_idroute2.default), auth, _controllers.event.deleteEvent);
  app.put('/events/:id', (0, _expressJoiValidator2.default)(_idroute2.default), auth, _controllers.event.editEvent);
  app.get('/events', auth, _controllers.event.getEvents);
};