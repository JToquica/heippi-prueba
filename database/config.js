const mongoose = require('mongoose');

const dbConnection = async () =>{
    try {
        mongoose.set("strictQuery", false);
        await mongoose.connect(process.env.Db_Connection);
        console.log('Database Online');
    } catch (error) {
        console.log(error);
        throw new Error('Error al iniciar Database');
    }
};

module.exports = {
    dbConnection
}