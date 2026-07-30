const express = require("express");

const app = express();

const cors = require('cors')
const path = require("path");
const loginRoutes = require("./api/routes/loginRoutes")
const viewerRoutes = require("./api/routes/viewerRoutes")

const adminRoutes = require("./api/routes/adminRoutes")
const errorHandler = require("./api/middlewares/errorHandler");


const corsOptions ={
    origin:['http://localhost:4173','http://localhost:5173'],
    credentials:true,   
    optionSuccessStatus:200
}



app.use(cors(corsOptions));

app.use(express.json());

app.use(express.urlencoded({extended: true}));
app.use("/api/viewer",viewerRoutes)
app.use("/api/login",loginRoutes)
app.use("/api/admin",adminRoutes)
console.log("kepek helye: ", path.join(__dirname, "..", "/img"))
app.use("/img",express.static(path.join(__dirname, "..", "/img"), {index: false,fallthrough: false}));// /api-ra szükség lesz élesben
app.use(errorHandler.notFoundError);

app.use(errorHandler.showError);
/*setInterval(() => {
  const used = process.memoryUsage();
  console.log({
    rss: Math.round(used.rss / 1024 / 1024) + " MB",
    heapTotal: Math.round(used.heapTotal / 1024 / 1024) + " MB",
    heapUsed: Math.round(used.heapUsed / 1024 / 1024) + " MB",
    external: Math.round(used.external / 1024 / 1024) + " MB"
  });
}, 5000);*/


module.exports = app;