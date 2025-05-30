import { Sequelize } from "sequelize";
import db from "../config/config.js";

const { DataTypes } = Sequelize;
const DeviceError = db.define(
  "deviceerror", {
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
  status: {
    allowNull: true,
    type: DataTypes.STRING,
  },
}, {
  freezeTableName: true,
}
);

export default DeviceError;