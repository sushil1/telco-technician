import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import uniqueValidator from 'mongoose-unique-validator';

const userSchema = new Schema(
	{
		email: {
			type: String,
			lowercase: true,
			required: true,
			trim: true,
			index: true,
			unique: true
		},
		role: {
			type: String,
			default: 'user'
		},
		passwordHash: { type: String, required: true },
		confirmed: { type: Boolean, default: false }
	},
	{ timestamps: true }
);

userSchema.methods.isValidPassword = function isValidPassword(password) {
	return bcrypt.compareSync(password, this.passwordHash);
};

userSchema.methods.generateJWT = function generateJWT() {
	return jwt.sign({ email: this.email }, process.env.JWT_SECRET);
};

userSchema.methods.toAuthJSON = function toAuthJSON() {
	return {
		email: this.email,
		confirmed: this.confirmed,
		token: this.generateJWT()
	};
};

userSchema.methods.setPassword = function setPassword(password) {
	this.passwordHash = bcrypt.hashSync(password, 10);
};

userSchema.plugin(uniqueValidator, {
	message: 'this email is already taken'
});

export default mongoose.model('User', userSchema);
