import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema(
    {
        email:{
            type: String,
            required: true,
            unique : true,
            lowercase:true,
            trim :true,
        },
        password : {
            type: String,
            required: [true, "please enter a password"],
            minlength :[6, "password must be at least 6 characters long"],
            select : false,
        },

    },
    {
        timestamps: true,
    }
);

userSchema.pre("save", async function(next){
    if(!this.isModified("password")) return next();

    const saltRounds =10;

    this.password = await bcrypt.hash(this.password, saltRounds);
    next();
});

userSchema.methods.comparePassword = async function (candidatePassword){
    return await bcrypt.compare(candidatePassword, this.password);
}

const User = mongoose.model("User", userSchema);

export default User;
