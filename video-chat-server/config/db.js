import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB подключен");
  } catch (error) {
    console.error("Ошибка подключения к MongoDB", error);
    process.exit(1);
  }
};

export default connectDB;
