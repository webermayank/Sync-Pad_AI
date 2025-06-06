import mongoose from 'mongoose';

const fileSchema = new mongoose.Schema(
    {
        filename: {
            type: String,
            required: true,
        },
        originalName: {
            type: String,
            required: true,
        },
        mimeType: {
            type: String,
            required: true,
        },
        size: {
            type: Number,
            required: true,
        },
        url: {
            type: String,
            required: true,
        },
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
            required: true,
        },
        key: {
            type: String,
        },
    },
    {
        timestamps: true,
    }
);

const file = mongoose.model("file", fileSchema);

export default file;