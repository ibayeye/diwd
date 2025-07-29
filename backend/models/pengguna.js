import bcrypt from "bcryptjs";
import { Sequelize } from "sequelize";
import db from "../config/config.js";

const { DataTypes } = Sequelize;
const Pengguna = db.define(
  "pengguna", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  activeSession: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  image: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  username: {
    allowNull: true,
    type: DataTypes.STRING,
    unique: true,
  },
  password: {
    allowNull: false,
    type: DataTypes.STRING,
    validate: {
      len: [6]
    }
  },
  email: {
    allowNull: false,
    type: DataTypes.STRING,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  nama: {
    allowNull: true,
    type: DataTypes.STRING,
  },
  nip: {
    allowNull: true,
    type: DataTypes.STRING,
  },
  no_hp: {
    allowNull: true,
    type: DataTypes.STRING,
  },
  role: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 0,
    validate: {
      isIn: [[0, 1, 2]] // 0:END USER, 1:PETUGAS, 2:SYSTEM_ENGINER
    }
  },
  isActive: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 0,
  },
  address: {
    allowNull: true,
    type: DataTypes.STRING(5000),
  }
}, {
  freezeTableName: true,
}
);
Pengguna.prototype.comparePassword = function (password) {
  return bcrypt.compare(password, this.password);
};

export default Pengguna;