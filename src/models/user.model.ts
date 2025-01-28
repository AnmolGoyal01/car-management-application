import mongoose, { Schema, Document } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export interface IUser extends Document {
    userName: string;
    fullName: string;
    email: string;
    password: string;
    isPasswordCorrect(password: string): Promise<boolean>;
    generateAccessToken(): string;
}

const userSchema = new Schema<IUser>(
    {
        userName: {
            type: String,
            required: [true, "userName is required"],
            min: [2, "username must be atleast 2 char"],
            unique: true,
            lowercase: true,
            trim: true,
            index: true,
        },
        fullName: {
            type: String,
            required: [true, "fullName is required"],
            min: [2, "fullName must be atleast 2 char"],
        },
        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true,
            lowercase: true,
            trim: true,
            match: [/\S+@\S+\.\S+/, "Please use a valid email address"],
        },
        password: {
            type: String,
            required: [true, "Password is required"],
            min: [6, "password must be atleast 6 char"],
        },
    },
    {
        timestamps: true,
    }
);

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});
userSchema.methods.isPasswordCorrect = async function (password: string) {
    return await bcrypt.compare(password, this.password);
};
userSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        {
            _id: this._id,
            userName: this.userName,
            fullName: this.fullName,
        },
        process.env.ACCESS_TOKEN_SECRET!,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY || "1d",
        } as jwt.SignOptions
    );
};

const User = mongoose.model<IUser>("User", userSchema);

export default User;
