import { Model, Schema } from 'mongoose';

import mongoose from 'mongoose';

export interface UserModel {
    _id: string;
    emailAddress: string;
    createdAt: Date;
    lastUpdatedAt: Date;
}

export interface UserWithPasswordModel extends UserModel {
    passwordHashSHA256: string;
}

const userSchema = new Schema<UserWithPasswordModel>({
    emailAddress: String,
    createdAt: Date,
    lastUpdatedAt: Date,
    passwordHashSHA256: String,
});

export default (mongoose.models.User as Model<UserWithPasswordModel>) ||
    mongoose.model('User', userSchema);
