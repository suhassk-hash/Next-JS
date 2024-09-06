import mongoose, { Schema, Document } from 'mongoose';

export interface Message extends Document {
    content: string;
    createdAt: Date;
}

const MessageSchema: Schema<Message> = new Schema({
    content: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now,
    }
});

export interface User extends Document {
    Username: string;
    password: string;
    email: string;
    verifyCode: string;
    verifyCodeExpire: Date;
    isAcceptingMessage: boolean;
    isVerified: boolean;
    messages: Message[];
}

const UserSchema: Schema<User> = new Schema({
    Username: {
        type: String,
        required: [true, 'Username is required'],
        trim: true,
        unique: true,
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: [/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/g, 'please use a valid email address']
    },
    verifyCode: {
        type: String,
        required: [true, 'Verify Code is required'],
    },
    verifyCodeExpire: {
        type: Date,
        required: [true, 'Verify Code Expiry is required'],
    },
    isAcceptingMessage: {
        type: Boolean,
        default: true,
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    messages: [MessageSchema],
});

const userModel = (mongoose.models.User as mongoose.Model<User>) || mongoose.model<User>("User", UserSchema);
export default userModel;