import mongoose from "mongoose";

const dbConnect = async () => {
  try {
    const connected = await mongoose.connect(process.env.MONGO_URI);
    mongoose.set("strictQuery", true);
    console.log(`MongoDB Connected: ${connected.connection.host}`);
  } catch (error) {
    console.log(`Error: ${error.message}`);
    process.exit(1);
  }
};

export default dbConnect;

//jayantaws001
//mkJaY6F5CdUmOLtZ
//mongodb+srv://jayantaws001:mkJaY6F5CdUmOLtZ@nodejs-ecommerce-api.b88ux.mongodb.net/
