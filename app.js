const express = require('express');
const path = require('path');

const app = express();

require('dotenv').config();

// Set up mongoose connection
const mongoose = require("mongoose");
mongoose.set("strictQuery", false);
const mongoDB = process.env.DATABASE_STRING;

main().catch((err) => console.log(err));
async function main() {
  await mongoose.connect(mongoDB);
}

// Use body-parser middleware to parse incoming request bodies
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));

// Set EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

const user_controller = require('./controllers/userController');
// Define routes
app.get('/', user_controller.user_create_get);

app.post('/', user_controller.user_create_post);

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
