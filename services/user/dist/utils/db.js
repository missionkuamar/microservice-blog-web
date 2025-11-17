import mongoose from "mongoose";
const connectDb = async () => {
    try {
        mongoose.connect(process.env.MONGO_URL);
        console.log("DB connected successfully");
    }
    catch (error) {
        console.log("Error in DB connection", error);
    }
};
export default connectDb;
//# sourceMappingURL=db.js.map