import mongoose from "mongoose";

/*Connect to mongo db */

export const connect = async () => {
    try {
        await mongoose
            .connect(`${process.env.MONGO_URI}`, {})
            .then(() => console.log(`Mongoose Connected`));
    } catch (error) {

        console.log(error);
    }
};
