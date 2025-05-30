import { Sequelize } from "sequelize";
import db from "../config/config.js";

const { DataTypes } = Sequelize;
const DeviceEarthquake = db.define(
    "deviceearthquake", {
    no: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    device_id: {
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
}, {
    freezeTableName: true,
}
);

export default DeviceEarthquake;