// ambiente (dev/prod)
process.env.NODE_ENV = "dev";

// dependências
let express = require("express");
let path = require("path");
let cookieParser = require("cookie-parser");
let logger = require("morgan");

// rotas
let indexRouter = require("./routes/index");
let testRouter = require("./routes/autoMail");
let authRouter = require("./routes/auth");
let usuarioRouter = require("./routes/usuario");

let app = express();

// config básica express
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// iniciando rotas
app.use("/", indexRouter);
app.use("/autoMail", testRouter);
app.use("/auth", authRouter);
app.use("/usuario", usuarioRouter);

module.exports = app;
