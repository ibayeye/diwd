import { Sequelize } from "sequelize";
import db from "../config/config.js";

const { DataTypes } = Sequelize;
const Device = db.define(
    "devicelist", {
    id: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
    },
    ip: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    location: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    alamat: {
        type: DataTypes.STRING(5000),
        allowNull: true,
    },
    memory: {
        type: DataTypes.STRING,
        allowNull: true,
    },
}, {
    freezeTableName: true,
}
);

export default Device;