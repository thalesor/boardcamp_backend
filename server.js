import express, { json } from "express";
import cors from "cors";

import { getCategories, postCategory } from "./controllers/categoryController.js";
import { getGames, postGame } from "./controllers/gameController.js";
import { getCustomers, getCustomer, postCustomer, updateCustomer } from "./controllers/customerController.js";
import { getRentals, postRental, finishRental, deleteRental } from "./controllers/rentalController.js";

import { categorySchema, customerSchema, gameSchema, rentalSchema } from "./services/joi-service.js";
import { validation } from "./middleware/validationMiddleware.js";

const app = express();

app.use(json());
app.use(cors());

app.post("/categories", validation(categorySchema), postCategory);
app.get("/categories", getCategories);
app.post("/games", validation(gameSchema), postGame);
app.get("/games", getGames);
app.get("/customers", getCustomers);
app.get("/customers/:id", getCustomer);
app.post("/customers", validation(customerSchema), postCustomer);
app.put("/customers/:id", validation(customerSchema), updateCustomer);
app.get("/rentals", getRentals);
app.post("/rentals", validation(rentalSchema), postRental);
app.post("/rentals/:id/return", finishRental);
app.delete("/rentals/:id", deleteRental);

app.listen(process.env.PORT || 4000, function(){
	console.log("Express server listening on port %d in %s mode :^)", this.address().port, app.settings.env);
  });
