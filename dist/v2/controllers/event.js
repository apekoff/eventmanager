'use strict';

var _sequelize = require('sequelize');

var _sequelize2 = _interopRequireDefault(_sequelize);

var _models = require('../models');

var _models2 = _interopRequireDefault(_models);

var _event = require('./_support/event');

var _event2 = _interopRequireDefault(_event);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

module.exports = {
  createEvent: function createEvent(req, res) {
    var event = new _event2.default(req.body);
    if (!event.safe()) {
      return res.status(400).json(event.getErrors());
    }

    // check if center exist
    _models2.default.centers.findOne({ where: { id: req.body.centerid } }).then(function (center) {
      if (!center) {
        return res.status(400).json({ error: true, message: { center: 'Invalid center' } });
      }

      // check if there is center for event at start date
      return _models2.default.events.findOne({
        where: {
          centerid: center.id,
          $or: [{
            $and: [{ startdate: _defineProperty({}, _sequelize2.default.Op.lte, new Date(event.startdate)) }, { enddate: _defineProperty({}, _sequelize2.default.Op.gte, new Date(event.startdate)) }]
          }, {
            $and: [{ startdate: _defineProperty({}, _sequelize2.default.Op.lte, new Date(event.enddate)) }, { enddate: _defineProperty({}, _sequelize2.default.Op.gte, new Date(event.enddate)) }]
          }]
        }
      }).then(function (existingEvent) {
        if (existingEvent) {
          return res.status(400).json({ error: true, message: { event: 'Center is not available' } });
        }
        // user must exist
        return _models2.default.users.findOne({
          where: { id: req.user.id }
        }).then(function (existingUsers) {
          if (!existingUsers) {
            return res.status(400).send('Invalid user');
          }

          // create event
          var validatedEvent = Object.assign({ userid: existingUsers.id, centerid: center.id }, event.toJSON());

          return _models2.default.events.create(validatedEvent).then(function (newEvent) {
            if (!newEvent) {
              return res.status(400).send('Can not create event');
            }
            return res.status(200).json(newEvent);
          });
        });
      });
    });
  },
  deleteEvent: function deleteEvent(req, res) {
    return _models2.default.events.findOne({
      where: {
        $and: [{ id: req.params.id }, { userid: req.user.id }]
      }
    }).then(function (event) {
      if (!event) {
        return res.status(400).json({ error: true, message: { event: 'Event does not exist.' } });
      }

      return _models2.default.events.destroy({
        where: { id: req.params.id }
      }).then(function (event) {
        return res.status(200).json(event);
      }).catch(function (error) {
        return res.status(500).json(error);
      });
    }).catch(function (error) {
      return res.status(500).json(error);
    });
  },
  getEvents: function getEvents(req, res) {
    return _models2.default.events.findAll({
      where: {
        userid: req.user.id
      }
    }).then(function (centers) {
      return res.status(200).json(centers);
    }).catch(function (error) {
      return res.status(400).send(error);
    });
  },
  editEvent: function editEvent(req, res) {
    return _models2.default.events.findOne({
      where: {
        $and: [{ id: req.params.id }, { userid: req.user.id }]
      }
    }).then(function (event) {
      if (!event) {
        return res.status(400).send('Event does not exist');
      }
      req.body.centerid = req.body.centerid ? req.body.centerid : event.centerid;

      if (parseInt(req.body.centerid) != req.body.centerid || req.body.centerid > 100000) {
        return res.status(400).json({ error: true, message: { center: 'Invalid center' } });
      }
      _models2.default.centers.findOne({ where: { id: req.body.centerid } }).then(function (center) {
        if (!center) {
          return res.status(400).json({ error: true, message: { center: 'Invalid center' } });
        }
        var mEvent = new _event2.default(event);
        mEvent.load(req.body);

        if (!mEvent.safe()) {
          return res.status(400).json(mEvent.getErrors());
        }
        var validatedEvent = Object.assign(mEvent.toJSON(), {
          centerid: center.id
        });

        return _models2.default.events.update(validatedEvent, {
          where: { id: req.params.id }
        }).then(function (event) {
          res.status(200).json(event);
        });
      });
    });
  }
};