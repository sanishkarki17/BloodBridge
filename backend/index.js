const express = require("express");
const cors = require("cors");
require("dotenv").config();

const donorsRouter = require("./routes/donors");
const requestsRouter = require("./routes/requests");
const authRouter = require("./routes/auth");
const adminRouter = require("./routes/admin");
const profileRouter = require("./routes/profile");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) =>
  res.json({ message: "BloodBridge backend (Nepal) running" })
);
app.use("/api/donors", donorsRouter);
app.use("/api/requests", requestsRouter);
app.use("/api/auth", authRouter);
app.use("/api/admin", adminRouter);
app.use("/api/profile", profileRouter);

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Server listening on ${port}`));
