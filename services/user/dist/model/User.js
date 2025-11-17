import mongoose from "mongoose";
const schema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        unique: true,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    instagram: String,
    facebook: String,
    linkedin: String,
    bio: String,
}, {
    timestamps: true,
});
const User = mongoose.model("User", schema);
//# sourceMappingURL=User.js.map