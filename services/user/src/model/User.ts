import mongoose, { Schema } from "mongoose";

export interface IUser extends Document {
    name: string;
    email: string;
    image: string;
    instagram: string;
    facebook: string;
    linkedin: string;
    bio: string;
}

const schema : Schema<IUser> = new mongoose.Schema({
    name:{
        type: String,
        required: true,
    },
     email:{
        type: String,
        unique: true,
        required: true,
    },
     image:{
        type: String,
        required: true,
    },
     instagram: String,
        facebook: String,
        linkedin: String,
        bio: String,
},{
    timestamps: true,
})

const User = mongoose.model<IUser>("User", schema);