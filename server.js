const mongoose = require("mongoose");
const { app } = require("./app");
const PORT = process.env.PORT || 5000;

require("dotenv").config();

mongoose.set("strictQuery", false);
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_MAIN);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
  });
});
