import {connect, disconnect} from "mongoose";
// async function connectToDatabase() {
//     try {
//         await connect(process.env.MONGODB_URL);
//     } catch (error) {
//         console.log(error);
//         throw new Error("Cannot Connect to MongoDB");
//     }
// }

async function connectToDatabase() {
    try {
        const mongoUrl = process.env.MONGODB_URL;

        if (!mongoUrl) {
            throw new Error("MONGODB_URL is not configured");
        }

        await connect(mongoUrl);
    } catch (error) {
        console.log(error);
        throw new Error("Cannot Connect to MongoDB");
    }
}

async function disconnectFromDatabase(){
    try {
        await disconnect();
    } catch (error) {
        console.log(error);
        throw new Error("Could not Disconnect From MongoDB");
    }
}

export { connectToDatabase , disconnectFromDatabase };