import { Sequelize } from "sequelize";
import db from "../config/config.js";

const { DataTypes } = Sequelize;
const WarningDevice = db.define(
    "warningdevice", {
    no: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    device_id: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    pengguna_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    warningType: {
        allowNull: false,
        type: DataTypes.STRING,
    },
    warningMessage: {
        allowNull: false,
        type: DataTypes.STRING,
    },
}, {
    freezeTableName: true,
}
);

export default WarningDevice;