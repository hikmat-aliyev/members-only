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

// Set EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// // Define routes
// app.get('/', (req, res) => {
//   res.render('user_form', { title: 'Members only club' });
// });

// app.post('/', (req, res) => {
//   res.render('user_homepage')
// })

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
