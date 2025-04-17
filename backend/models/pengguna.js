import bcrypt from "bcrypt";
import { Sequelize } from "sequelize";
import db from "../config/config.js";

const { DataTypes } = Sequelize;
const Pengguna = db.define(
  "pengguna", {
  id: {
    allowNull: false,
    primaryKey: true,
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4
  },
  activeSession: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  apiKey: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
  },
  image: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  username: {
    allowNull: false,
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
    allowNull: false,
    type: DataTypes.STRING,
  },
  nip: {
    allowNull: false,
    type: DataTypes.BIGINT,
  },
  no_hp: {
    allowNull: false,
    type: DataTypes.BIGINT,
  },
  role: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    validate: {
      isIn: [[0, 1, 2]] // 0:END USER, 1:PETUGAS, 2:SYSTEM_ENGINER
    }
  },
}, {
  freezeTableName: true,
}
);
Pengguna.prototype.comparePassword = function (password) {
  return bcrypt.compare(password, this.password);
};

export default Pengguna;