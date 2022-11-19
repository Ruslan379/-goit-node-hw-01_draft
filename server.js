const app = require('./app');

const { lineBreak } = require("./service");


//----------------------------------------------------------------
//todo CONSPECT
// app.listen(3000, () => {
//   console.log("Server running. Use our API on port: 3000")
// })


//* Перенесен из ap.js
// const PORT = 3000;
// const PORT = process.env.PORT;
// const PORT = process.env.PORT || 3000;
const { PORT = 3000 } = process.env; //! +++++


//* Перенесен из ap.js
app.listen(PORT, (err) => {
  if (err) console.error("Error at server launch", err.message);
  console.log(`Server is running on the port: ${PORT}`.bgGreen.red);
  lineBreak();
});