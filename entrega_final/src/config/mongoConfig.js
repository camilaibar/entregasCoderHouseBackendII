import { connect } from "mongoose";

const mongoDBConnection = async () => {
  try {
    await connect(
      process.env.MONGO_CONNECTION_STRING ||
        "mongodb://localhost:27017/coderhouse"
    );
    console.log("DB connected");
  } catch (error) {
    console.error(error);
    throw new Error(error);
  }
};

export default mongoDBConnection;
