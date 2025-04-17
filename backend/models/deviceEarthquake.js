import bcrypt from "bcrypt";
import { Sequelize } from "sequelize";
import db from "../config/config.js";

const { DataTypes } = Sequelize;
const DeviceEarthquake = db.define(
    "deviceEarthquake", {
    no: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    id: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    ip: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    location: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    memory: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    onSiteTime: {
        allowNull: true,
        type: DataTypes.STRING,
    },
    onSiteValue: {
        allowNull: true,
        type: DataTypes.STRING,
    },
    regCD: {
        allowNull: true,
        type: DataTypes.STRING,
    },
    regTime: {
        allowNull: true,
        type: DataTypes.STRING,
    },
    regValue: {
        allowNull: true,
        type: DataTypes.STRING,
    },
    status: {
        allowNull: true,
        type: DataTypes.STRING,
    },
}, {
    freezeTableName: true,
}
);

export default DeviceEarthquake;