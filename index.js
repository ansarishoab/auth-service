require('dotenv').config();

const mode = process.env.MODE
if (mode === "server") {
    require('./server')
} else {
    console.log("Running in ZZZZZ mode");
}
