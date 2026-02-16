const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

/**
 * User Schema
 * - name: display name
 * - email: unique, used for login
 * - password: hashed before save using bcrypt
 */
const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Name is required'],
            trim: true,
            maxlength: 50,
        },
        email: {
            type: String,
            required: [true, 'Email is required'],
            unique: true,
            lowercase: true,
            trim: true,
        },
        password: {
            type: String,
            required: [true, 'Password is required'],
            minlength: 6,
            select: false, // Don't return password in queries by default
        },
    },
    { timestamps: true }
);

/**
 * Pre-save hook: hash the password before storing it.
 * Only runs if the password field was modified (e.g. on signup or password change).
 */
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

/**
 * Instance method: compare a candidate password with the stored hash.
 */
userSchema.methods.comparePassword = async function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
