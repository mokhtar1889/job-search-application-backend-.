import mongoose from "mongoose";

export let connectDb = async () => {
  return await mongoose
    .connect(process.env.DATABASE_CONNECTION)
    .then(() => {
      console.log("database connected successfully");
    })
    .catch((error) => {
      console.log("error in connection", error.message);
    });
};
