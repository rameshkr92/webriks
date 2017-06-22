'use strict';

module.exports = function(sequelize, DataTypes) {
    var ContactUs = sequelize.define('contact_us', {
            contact_name: DataTypes.STRING,
            contact_email: DataTypes.STRING,
            contact_phone: DataTypes.STRING,
            subject: DataTypes.STRING,
            content: DataTypes.TEXT
        }, {
            associate: function(models){
                ContactUs.belongsTo(models.User);
                ContactUs.hasMany(models.user_contact);
            }
        }
    );
    return ContactUs;
};
