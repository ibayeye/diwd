import config from '../config/config.js'
import database from '../config/firebase.js'
import Device from "../models/device.js";
import DeviceEarthquake from "../models/deviceEarthquake.js";
import DeviceError from "../models/deviceError.js";
import Pengguna from "../models/pengguna.js";
import WarningDevice from '../models/warningDevice.js';
const defineAssociations = () => {

    // Relasi Device dan deviceEarthquake
    Device.hasMany(DeviceEarthquake, { foreignKey: "device_id", as: "deviceearthquake" });
    DeviceEarthquake.belongsTo(Device, { foreignKey: "device_id", as: "devicelist" });

    // Relasi Device dan deviceError
    Device.hasMany(DeviceError, { foreignKey: "device_id", as: "deviceerror" });
    DeviceError.belongsTo(Device, { foreignKey: "device_id", as: "devicelist" });

    // Relasi Pengguna dan warningDevice
    Pengguna.hasMany(WarningDevice, { foreignKey: "pengguna_id", as: "warningdevice" });
    WarningDevice.belongsTo(Pengguna, { foreignKey: "pengguna_id", as: "pengguna" });

    // Relasi Device dan warningDevice
    Device.hasMany(WarningDevice, { foreignKey: "device_id", as: "warningdevice" });
    WarningDevice.belongsTo(Device, { foreignKey: "device_id", as: "devicelist" });
};

defineAssociations();

const syncDatabase = async () => {
    try {
        await config.authenticate();
        console.log("Database Connected...");

        console.log("Firebase initialized " + JSON.stringify(database));

        // await config.sync({alter: true})

        // Sinkronisasi model secara berurutan
        await Pengguna.sync();
        console.log("Pengguna synced.");

        await Device.sync();
        console.log("Device synced.");

        await WarningDevice.sync();
        console.log("Warning Device synced.");

        await DeviceError.sync();
        console.log("Device Error synced.");

        await DeviceEarthquake.sync();
        console.log("Device Earthquake synced.");

    } catch (error) {
        console.error("Unable to connect to the database:", error);
        process.exit(1);
    }
};

export { database, syncDatabase };