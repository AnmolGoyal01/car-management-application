import mongoose, { Schema, Document } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";
import { IUser } from "./user.model";

export interface ICar extends Document {
    title: string;
    description: string;
    images: string[];
    tags: string[];
    owner: IUser;
}

const carSchema = new Schema<ICar>(
    {
        title: {
            type: String,
            required: [true, "Title is required"],
            min: [2, "Title must be atleast 2 char"],
            trim: true,
        },
        description: {
            type: String,
            default: "",
        },
        images: {
            type: [String],
            required: [true, "Images is required"],
            validate: {
                validator: (v: string[]) => v.length > 0,
                message: "Images must have atleast 1 image",
            },
        },
        tags: {
            type: [String],
            default: [],
        },
        owner: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

carSchema.plugin(mongooseAggregatePaginate);

export default mongoose.model<ICar>("Car", carSchema);