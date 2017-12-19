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
		confirmed: { type: Boolean, default: false },

		confirmationToken: { type: String, default: '' }
	},
	{ timestamps: true }
);

userSchema.methods.setPassword = function setPassword(password) {
	this.passwordHash = bcrypt.hashSync(password, 10);
};

userSchema.methods.isValidPassword = function isValidPassword(password) {
	return bcrypt.compareSync(password, this.passwordHash);
};

userSchema.methods.generateJWT = function generateJWT() {
	return jwt.sign(
		{ email: this.email, confirmed: this.confirmed },
		process.env.JWT_SECRET
	);
};

userSchema.methods.toAuthJSON = function toAuthJSON() {
	return {
		email: this.email,
		confirmed: this.confirmed,
		token: this.generateJWT()
	};
};

userSchema.methods.generateResetPasswordToken = function generateResetPasswordToken() {
	return jwt.sign(
		{
			_id: this._id
		},
		process.env.JWT_SECRET,
		{ expiresIn: '1h' }
	);
};

userSchema.methods.generateResetPasswordLink = function generateResetPasswordLink() {
	return `${
		process.env.HOST
	}/reset_password/${this.generateResetPasswordToken()}`;
};

userSchema.methods.generateConfirmationUrl = function generateConfirmationUrl() {
	return `${process.env.HOST}/confirmation/${this.confirmationToken}`;
};

userSchema.methods.generateConfirmationToken = function generateConfirmationToken() {
	this.confirmationToken = this.generateJWT();
};

userSchema.plugin(uniqueValidator, {
	message: 'this email is already taken'
});

export default mongoose.model('User', userSchema);
