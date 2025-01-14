import { Sequelize } from "sequelize";
import dotenv from 'dotenv';

dotenv.config();
const db = new Sequelize({
  host: "bughchgyl1r5xzbepdit-mysql.services.clever-cloud.com",
  username: "ufdfqkspjtqyhd6a",
  password: "87410fRim7dTuvdqLrM3",
  database: "bughchgyl1r5xzbepdit",
  port: "3306",
  dialect: "mysql",
});

export default db;
