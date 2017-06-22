'use strict';

module.exports = function(sequelize, DataTypes) {
    var UserContact = sequelize.define('user_contact', {
            // user_id: DataTypes.INTEGER,
            // contact_id: DataTypes.INTEGER
        },
        {
            associate: function(models){
                UserContact.belongsTo(models.contact_us);
                UserContact.belongsTo(models.User);
                // UserContact.belongsTo(models.contact_us, { foreignKey:'contact_id', foreignKeyConstraint:true} );
                // UserContact.belongsTo(models.User, { foreignKey:'user_id', foreignKeyConstraint:true} );
            }
        }
    );
    return UserContact;
};
