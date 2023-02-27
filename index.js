const express = require('express');
require('dotenv').config();
const { dbConnection } = require('./database/config');
const cors = require('cors');


const app = express();
app.use(cors());
app.use(express.json());
dbConnection();

app.use('/api/auth', require('./routes/auth'));
app.use('/api/observacion', require('./routes/observacion'));

var port = process.env.PORT || 4001;

app.listen(port, "0.0.0.0", () =>{
    console.log(`Servidor corriendo en el puerto ${port}`);
});