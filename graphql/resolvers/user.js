//Requires from node_modules
const bcrypt = require('bcryptjs');
//Requires from the project
const User = require('../../models/user');

module.exports = {
    //mutation for create users, using bcrypt to encrypt the password
    createUser: async args => {
        try {
            const existingUser = await User.findOne({ email: args.userInput.email })
            if (existingUser) {
                throw new Error('User exists already.')
            }
            const hashedPassword = await bcrypt.hash(args.userInput.password, 12)
            const user = new User({
                username: args.userInput.username,
                email: args.userInput.email,
                password: hashedPassword
            })
            const result = await user.save();
            return { ...result._doc, password: null };
        } catch (err) {
            throw err;
        }
    },
}