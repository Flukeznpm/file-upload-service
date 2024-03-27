require('dotenv').config();

const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const { authorize } = require("./middleware/authorize")
const initialPath = require("./router/initial/index")
const authPath = require("./router/auth/index")
const workflowPath = require("./router/workflow/index")

app.use("/file-upload-service/initial", initialPath);
app.use("/file-upload-service/auth", authPath);
app.use(authorize)
app.use("/file-upload-service/workflow", workflowPath);


app.listen(port, () => { console.log(`Listening on port ${port}`) });