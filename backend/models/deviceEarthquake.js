import bcrypt from "bcrypt";
import { Sequelize } from "sequelize";
import db from "../config/config.js";

const { DataTypes } = Sequelize;
const DeviceEarthquake = db.define(
  "deviceEarthquake", {
  id: {
    type: DataTypes.STRING,
    allowNull: false,
    primaryKey: true,
  },
  ip: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  location: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  memory: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  onSiteTime: {
    allowNull: false,
    type: DataTypes.STRING,
  },
  onSiteValue: {
    allowNull: false,
    type: DataTypes.STRING,
  },
  regCD: {
    allowNull: false,
    type: DataTypes.STRING,
  },
  regTime: {
    allowNull: false,
    type: DataTypes.STRING,
  },
  regValue: {
    allowNull: false,
    type: DataTypes.STRING,
  },
  status: {
    allowNull: false,
    type: DataTypes.STRING,
  },
}, {
  freezeTableName: true,
}
);

export default DeviceEarthquake;