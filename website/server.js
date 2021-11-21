// ambiente (dev/prod)
process.env.NODE_ENV = "production";
process.env.EC2_DNS = "ec2-18-209-17-92.compute-1.amazonaws.com";

// dependências
let fs = require("fs");
let express = require("express");
let path = require("path");
let cookieParser = require("cookie-parser");
let logger = require("morgan");

// rotas
let indexRouter = require("./routes/index");
let authRouter = require("./routes/auth");
let usuarioRouter = require("./routes/usuario");
let staffRouter = require("./routes/staff");
let empresaRouter = require("./routes/empresa");
let maquinaRouter = require("./routes/maquina");
let medicaoRouter = require("./routes/medicao");
let chamadoRouter = require("./routes/chamado");
let analyticsRouter = require("./routes/analytics");
let notificacaoRouter = require("./routes/notificacao");

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
app.use("/usuario", usuarioRouter);
app.use("/empresa", empresaRouter);
app.use("/maquina", maquinaRouter);
app.use("/medicao", medicaoRouter);
app.use("/chamado", chamadoRouter);
app.use("/analytics", analyticsRouter);
app.use("/notificacao", notificacaoRouter);

app.get("/:page", (req, res) => {
    let pagePath = path.resolve(__dirname, "public", `${req.params.page}.html`);

    if (fs.existsSync(pagePath)) {
        res.sendFile(pagePath);
    } else {
        res.status(404).sendFile("public/pag-404.html", {root: __dirname});
    }
});

// app.use((req, res, next) => {
//     res.status(404).sendFile("public/index.html", {root: __dirname});
// });

// app.use((req, res, next) => {
//     res.status(404).sendFile("public/404.html", { root: __dirname });
// });

module.exports = app;
