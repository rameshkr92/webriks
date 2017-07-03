'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./../errors.server.controller.js'),
	User = mongoose.model('User'),
	_ = require('lodash');



/**
 * Update a User
 */
exports.update = function(req, res) {
	var tempuser = req.tempuser ;
	tempuser = _.extend(tempuser, req.body);
	tempuser.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(tempuser);
		}
	});
};

/**
 * Delete an Admin
 */
exports.delete = function(req, res) {
	var tempuser = req.tempuser ;
	tempuser.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(tempuser);
		}
	});
};

/**
 * List of Users
 */
exports.list = function(req, res) {
	User.find({}, '-password').sort('-created').populate('user', 'displayName').exec(function(err, users) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(users);
		}
	});
};

/**
 * Show the current user
 */
exports.read = function(req, res) {
	res.json(req.user);
};

/**
 * Admin middleware
 */
exports.userByID = function(req, res, next, id) {
	User.findById(id).populate('user', 'displayName').exec(function(err, user) {
		if (err) return next(err);
		if (! user) return next(new Error('Failed to load User ' + id));
		req.tempuser = user ;
		next();
	});
};

/**
 * Admin authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.admin.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};

/**
 * Admin Role middleware
 */
exports.isAdmin = function(req, res, next) {
	if (req.user.roles.indexOf('admin') === -1) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
