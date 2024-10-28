import { connect } from "mongoose";

const mongoDBConnection = async () => {
  try {
    await connect(process.env.MONGO_CONNECTION_STRING);
    console.log("DB connected");
  } catch (error) {
    console.error(error);
    throw new Error(error);
  }
};

export default mongoDBConnection;
