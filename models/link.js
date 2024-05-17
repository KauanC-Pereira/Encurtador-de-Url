const Sequelize = require('sequelize')

const link = (sequelize, DataTypes) => {
    const Link = sequelize.define('Link', {
        id: {
            type: Sequelize.INTEGER.UNSIGNED,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true
        },
        code: {
            type: Sequelize.STRING,
            allowNull: false
        },
        url: {
            type: Sequelize.STRING,
            allowNull: false
        },
        hits: {
            type: Sequelize.INTEGER.UNSIGNED,
            allowNull: true,
            defaultValue: 0
        },
        
    },  {
        tableName: 'LinksEncutados'
    })
    return Link
}
module.exports = link;