'use strict';

/**
 * User Model
 */

var crypto = require('crypto');

module.exports = function(sequelize, DataTypes) {
    var User = sequelize.define('User', {
            fullname: DataTypes.STRING,
            // email: DataTypes.STRING,
            email: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    isEmail: true
                },
                unique: {
                    args: true,
                    msg: 'Email address already in use!'
                }
            },
            username: {
                type: DataTypes.STRING,
                allowNull: false,
                // isUnique: true
                unique: {
                    args: true,
                    msg: 'Username already in use!'
                }
            },
            password: DataTypes.STRING,
            provider: DataTypes.STRING,
            salt: DataTypes.STRING,
            address: DataTypes.STRING,
            lat: DataTypes.STRING,
            lng: DataTypes.STRING,
            ipAddress: DataTypes.STRING,
            city: DataTypes.STRING,
            zipcode: DataTypes.STRING,
            gender: DataTypes.STRING,
            isVerified: {
                type: DataTypes.ENUM('yes', 'no'),
                allowNull: false,
                defaultValue: 'no'
            },
            isActive: {
                type: DataTypes.ENUM('yes', 'no','suspended'),
                allowNull: false,
                defaultValue: 'no'
            },
            activationSecret: DataTypes.STRING,
            phoneNumber: DataTypes.STRING,
            facebookUserId: DataTypes.INTEGER,
            twitterUserId: DataTypes.INTEGER,
            twitterKey: DataTypes.STRING,
            twitterSecret: DataTypes.STRING,
            github: DataTypes.STRING,
            openId: DataTypes.STRING,
            avatar: {
                type: DataTypes.STRING,
                defaultValue: 'modules/users/client/img/profile/default.png'
            },
            roles: {
                type: DataTypes.STRING,
                defaultValue: 'user'
            }
        }, {
            instanceMethods: {
                toJSON: function () {
                    var values = this.get();
                    delete values.password;
                    delete values.salt;
                    return values;
                },
                makeSalt: function() {
                    return crypto.randomBytes(16).toString('base64');
                },
                authenticate: function(plainText){
                    return this.encryptPassword(plainText, this.salt) === this.password;
                },
                encryptPassword: function(password, salt) {
                    if (!password || !salt) {
                        return '';
                    }
                    salt = new Buffer(salt, 'base64');
                    return crypto.pbkdf2Sync(password, salt, 10000, 64).toString('base64');
                }
            },
            associate: function(models) {
                User.hasMany(models.Article);
                User.hasMany(models.user_contact);
            }
        }
    );
    return User;
};
