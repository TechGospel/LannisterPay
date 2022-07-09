import express from "express";
import cors from "cors";
import compute from "./Controllers/split-payments";

//Server declaration
const App = express();
const port = process.env.PORT || 3000;

//Middleware Instantiation
App.use(cors());

//Server Initiation
App.listen(port, () => {
	console.log(`This server is up and running on port ${port} 😎`);
});

// Server routes
App.get("/", (req, res) => {
	res.send("Welcome home");
});

App.post("/split-payments/compute", compute(req, res));
