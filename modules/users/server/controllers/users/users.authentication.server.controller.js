'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
    config = require(path.resolve('./config/config')),
    passport = require('passport'),
    db = require(path.resolve('./config/lib/sequelize'));
var nodemailer = require('nodemailer');
var smtpTransport = nodemailer.createTransport(config.mailer.options);
var errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));
var crypto = require('crypto');
// URLs for which user can't be redirected on signin
var noReturnUrls = [
    '/authentication/signin',
    '/authentication/signup'
];

/**
 * Signup
 */
exports.signup = function (req, res) {
    // For security measurement we remove the roles from the req.body object
    delete req.body.roles;

    // Init Variables
    var user = db.User.build(req.body);
    var message = null;
// console.log(user.password); return false;
var upass = user.password;
    // Add missing user fields
    user.provider = 'local';
    user.ipAddress = req.ip;
    user.isVerified = 'no';
    user.isActive = 'no';
    user.activationSecret = crypto.randomBytes(32).toString('hex');
    user.salt = user.makeSalt();
    user.password = user.encryptPassword(req.body.password, user.salt);
    // Then save the user
    user.save().then(function(){
        req.login(user, function(err){
            // Remove sensitive data before login
            user.password = undefined;
            user.salt = undefined;

            // res.json(user);
            //send mail to registered user mail start here
            var httpTransport = 'http://';
            if (config.secure && config.secure.ssl === true) {
                httpTransport = 'https://';
            }
            res.render(path.resolve('modules/users/server/templates/signup-email'), {
                name: user.fullname,
                appName: config.app.title,
                userEmail: user.email,
                userPassword: upass,
                webUrl: httpTransport + req.headers.host//,
                // url: httpTransport + req.headers.host + '/api/auth/reset/' + token
            }, function (err, emailHTML) {
                // done(err, emailHTML, user);
                //send mail if template file found
                var mailOptions = {
                    to: user.email,
                    from: config.mailer.from,
                    subject: 'Registration Successfull',
                    html: emailHTML
                };
                smtpTransport.sendMail(mailOptions, function (err) {
                    if (!err) {
                        // res.send({
                        //     message: 'An email has been sent to the provided email with further instructions.'
                        // });
                        message: 'An email has been sent to the provided email with further instructions.';
                        res.json(user);
                    } else {
                        return res.status(400).send({
                            message: 'Failure sending email'
                        });
                    }
                });
            });
            //send mail to registered user mail end here
        });
    }).catch(function(err){
        // console.log(errorHandler.getErrorMessage(err)); return false;
        // Remove sensitive data before login
        user.password = undefined;
        user.salt = undefined;
        return res.status(422).send({
            message: errorHandler.getErrorMessage(err),
            user: user
        });
        // res.render('/authentication/signup',{
        //     message: message,
        //     user: user
        // });
    });
};

/**
 * Signin after passport authentication
 */
exports.signin = function (req, res, next) {
    passport.authenticate('local', function (err, user, info) {
        if (err || !user) {
            res.status(400).send(info);
        } else {
            // Remove sensitive data before login
            user.password = undefined;
            user.salt = undefined;

            req.login(user, function (err) {
                if (err) {
                    res.status(400).send(err);
                } else {
                    res.json(user);
                }
            });
        }
    })(req, res, next);
};

/**
 * Signout
 */
exports.signout = function (req, res) {
    req.logout();
    res.redirect('/');
};

/**
 * OAuth provider call
 */
exports.oauthCall = function (strategy, scope) {
    return function (req, res, next) {
        // Set redirection path on session.
        // Do not redirect to a signin or signup page
        if (noReturnUrls.indexOf(req.query.redirect_to) === -1) {
            req.session.redirect_to = req.query.redirect_to;
        }
        // Authenticate
        passport.authenticate(strategy, scope)(req, res, next);
    };
};

/**
 * OAuth callback
 */
exports.oauthCallback = function (strategy) {
    return function (req, res, next) {
        // Pop redirect URL from session
        var sessionRedirectURL = req.session.redirect_to;
        delete req.session.redirect_to;

        passport.authenticate(strategy, function (err, user, redirectURL) {
            if (err) {
                return res.redirect('/authentication/signin?err=' + encodeURIComponent(err));
            }
            if (!user) {
                return res.redirect('/authentication/signin');
            }
            req.login(user, function (err) {
                if (err) {
                    return res.redirect('/authentication/signin');
                }

                return res.redirect(redirectURL || sessionRedirectURL || '/');
            });
        })(req, res, next);
    };
};

/**
 * Helper function to save or update a OAuth user profile TODO exports.saveOAuthUserProfile = function (req, providerUserProfile, done) {
 */

/**
 * Remove OAuth provider TODO (exports.removeOAuthProvider = function (req, res, next))
 */
