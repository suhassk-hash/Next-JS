import mongoose from "mongoose";

type ConnectionObject={
    isConnected?: number
}

const conn : ConnectionObject = {};

async function dbConnect():Promise<void>{
    if(conn.isConnected){
        console.log("Using existing connection");
        return
    }
    try{
        const db=await mongoose.connect(process.env.MONGODB_URI || '', {} )
        conn.isConnected = db.connections[0].readyState
        console.log("New connection created");
    }
    catch(err){
        console.log("db Connection failed");
        console.log(err);
        process.exit(1);
    }
}

export default dbConnect