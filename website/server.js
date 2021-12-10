// ambiente (dev/prod)
process.env.NODE_ENV = process.argv[2] || "production";
process.env.EC2_DNS = "safelog.sytes.net";
// usar no-ip com dns publico da instancia => web redirect

// dependências
let fs = require("fs");
let express = require("express");
let path = require("path");
let cookieParser = require("cookie-parser");
let logger = require("morgan");

// rotas
let indexRouter = require("./routes/index");
let authRouter = require("./routes/auth");
let userRouter = require("./routes/user");
let staffRouter = require("./routes/staff");
let companyRouter = require("./routes/company");
let machineRouter = require("./routes/machine");
let measurmentRouter = require("./routes/measurment");
let safedeskCallRouter = require("./routes/safedeskCall");
let analyticsRouter = require("./routes/analytics");
let notificationRouter = require("./routes/notification");

let app = express();

// config básica express
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// iniciando rotas
app.use("/", indexRouter);
app.use("/auth", authRouter);
app.use("/staff", staffRouter);
app.use("/user", userRouter);
app.use("/company", companyRouter);
app.use("/machine", machineRouter);
app.use("/measurment", measurmentRouter);
app.use("/safedesk-call", safedeskCallRouter);
app.use("/analytics", analyticsRouter);
app.use("/notification", notificationRouter);

app.get("/:page", (req, res) => {
    let pagePath = path.resolve(__dirname, "public", `${req.params.page}.html`);

    if (fs.existsSync(pagePath)) {
        res.sendFile(pagePath);
    } else {
        res.status(404).sendFile("public/pag-404.html", {root: __dirname});
    }
});

module.exports = app;
