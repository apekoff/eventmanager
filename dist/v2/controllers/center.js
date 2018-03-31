'use strict';

var _sequelize = require('sequelize');

var _sequelize2 = _interopRequireDefault(_sequelize);

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _center = require('./_support/center');

var _models = require('../models');

var _models2 = _interopRequireDefault(_models);

var _url = require('url');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

module.exports = {
  createCenter: function createCenter(req, res) {
    var center = new _center.Center(req.body);
    if (!center.safe()) {
      return res.status(400).json(center.getErrors());
    }
    req.body.ownerid = req.user.id;
    req.body.contact.ownerid = req.body.ownerid;

    return _models2.default.users.findById(req.body.ownerid).then(function (user) {
      if (!user) {
        return res.status(400).send({ error: true, message: 'Center must have a valid owner' });
      }

      if (req.body.newContact) {
        return _models2.default.contacts.create(req.body.contact).then(function (contact) {
          req.body.contactid = contact.id;
          return (0, _center.create)(req, res, _models2.default);
        });
      }
      return (0, _center.create)(req, res, _models2.default);
    }).catch(function (error) {
      console.log(error);
      res.status(501).send(error);
    });
  },
  getCenters: function getCenters(req, res) {
    return _models2.default.centers.findAll().then(function (centers) {
      return res.status(200).json(centers);
    }).catch(function (error) {
      return res.status(501).send(error);
    });
  },
  getAdminCenters: function getAdminCenters(req, res) {
    return _models2.default.centers.findAll({
      include: [{
        model: _models2.default.events,
        as: 'events'
      }],
      where: {
        ownerid: req.user.id
      }
    }).then(function (center) {
      return res.status(200).json(center);
    }).catch(function (error) {
      return res.status(500).json(error);
    });
  },
  getCenter: function getCenter(req, res) {
    return _models2.default.centers.findById(req.params.id).then(function (center) {
      if (!center) {
        return res.status(404).json({ message: 'Center not found' });
      }
      return res.status(200).json(center);
    }).catch(function (error) {
      return res.status(500).send(error);
    });
  },
  editCenter: function editCenter(req, res) {
    // TODO: CHECK IF ITS THE OWNER OF THE CENTER THAT IS EDITING
    return _models2.default.centers.find({
      where: {
        id: req.params.id,
        ownerid: req.user.id
      }
    }).then(function (center) {
      if (!center) {
        return res.status(401).json({ error: true, message: 'Center does not exist' });
      }

      var mCenter = new _center.Center(center);
      mCenter.load(req.body);

      if (!mCenter.safe()) {
        return res.status(400).json({ error: true, message: mCenter.getErrors() });
      }
      req.body.center = mCenter.toJSON();
      if (req.body.newContact) {
        return _models2.default.contacts.create(req.body.contact).then(function (contact) {
          req.body.contactid = contact.id;
          return (0, _center.update)(req, res, _models2.default);
        });
      }
      return (0, _center.update)(req, res, _models2.default);
    }).catch(function (error) {
      return res.status(501).send(error);
    });
  },
  getCenterWithEvents: function getCenterWithEvents(req, res) {
    return _models2.default.centers.findOne({
      include: [{
        model: _models2.default.events,
        as: 'events'
      }],
      where: {
        id: req.params.id,
        ownerid: req.user.id
      }
    }).then(function (center) {
      return res.status(200).json(center);
    }).catch(function (error) {
      return res.status(500).json(error);
    });
  },
  getCenterByDate: function getCenterByDate(req, res) {
    return _models2.default.events.findAll({
      attributes: ['centerid'],
      where: {
        centerid: center.id,
        $or: [{
          $and: [{ startdate: _defineProperty({}, _sequelize2.default.Op.lte, new Date(date)) }, { enddate: _defineProperty({}, _sequelize2.default.Op.gte, new Date(date)) }]
        }, {
          $and: [{ startdate: _defineProperty({}, _sequelize2.default.Op.lte, new Date(date)) }, { enddate: _defineProperty({}, _sequelize2.default.Op.gte, new Date(date)) }]
        }]
      }
    }).then(function (centersid) {
      console.log(centersid);
      return res.json(centersii);
    }).catch(function (error) {
      return res.status(500).json(error);
    });
  },
  getContacts: function getContacts(req, res) {
    return _models2.default.contacts.findAll({
      where: {
        ownerid: req.user.id
      }
    }).then(function (contacts) {
      return res.status(200).json(contacts);
    }).catch(function (error) {
      console.log(error);
      res.status(400).send(error);
    });
  },
  search: function search(req, res) {
    var _req$query = req.query,
        name = _req$query.name,
        area = _req$query.area,
        state = _req$query.state,
        capacity = _req$query.capacity,
        type = _req$query.type,
        facilities = _req$query.facilities,
        amount = _req$query.amount;


    var searchCondition = '';

    if (name && name.length > 1) {
      searchCondition += ' AND lower(name) LIKE \'%' + name.toLowerCase() + '%\'';
    }
    if (area && area.length > 1) {
      searchCondition += ' AND lower(area) LIKE \'%' + area.toLowerCase() + '%\'';
    }

    var stateInt = parseInt(state);
    if (state && stateInt >= 0 && stateInt < 36) searchCondition += ' AND state=\'' + state + '\'';
    if (capacity && parseInt(capacity) > 0) searchCondition += ' AND capacity=\'' + capacity + '\'';

    var typeInt = parseInt(type);
    if (type && typeInt >= 0) searchCondition += ' AND type=\'' + type + '\'';

    var amountInt = parseInt(amount);
    if (amount && amountInt >= 1) searchCondition += ' AND amount=\'' + amountInt + '\'';

    if (facilities) {
      var facilitiesBuilt = '(' + facilities.split(',').map(function (facility, i) {
        facility = facility.toLowerCase();
        i === 0 ? 'lower(facilities) LIKE \'%' + facility + '%\'' : ' OR lower(facilities) LIKE \'%' + facility + '\'';
      }).join() + ')';
      searchCondition += ' AND ' + facilitiesBuilt;
    }
    var END_OF_FIRST_AND = 3;
    searchCondition = 'WHERE' + searchCondition.trim().substr(END_OF_FIRST_AND, searchCondition.length);

    return _models2.default.sequelize.query('SELECT * FROM centers ' + searchCondition, {
      type: _sequelize2.default.QueryTypes.SELECT
    }).then(function (centers) {
      return res.status(200).json(centers);
    }).catch(function (e) {
      return console.log(e);
    });
  },
  getOwnCenters: function getOwnCenters(req, res) {
    return _models2.default.centers.findAll({
      where: {
        ownerid: req.user.id
      }
    }).then(function (centers) {
      return res.status(200).json(centers);
    }).catch(function (error) {
      return res.status(501).send(error);
    });
  },
  getOwnEvents: function getOwnEvents(req, res) {
    return _models2.default.sequelize.query('SELECT *, events.id as eid FROM events, centers WHERE events.centerid = centers.id AND centers.ownerid = :ownerid', { replacements: { ownerid: req.user.id }, type: _sequelize2.default.QueryTypes.SELECT }).then(function (events) {
      events = events.map(function (event) {
        var enddate = (0, _moment2.default)(event.enddate);
        var now = (0, _moment2.default)();
        event.isConcluded = now.diff(enddate, 'days') > 0;
        return event;
      });
      res.status(200).json(events);
    }).catch(function (e) {
      return console.log(e);
    });
  }
};