//Requires from node_modules
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
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
                rol: 'User',
                password: hashedPassword
            })
            const result = await user.save();
            return { ...result._doc, password: null };
        } catch (err) {
            throw err;
        }
    },
    login: async ({ email, password }) => {
        const user = await User.findOne({ email: email });
        if (!user) {
            throw new Error('User doesn\'t exist!');
        }
        const isEqual = await bcrypt.compare(password, user.password);
        if (!isEqual) {
            throw new Error('Password is incorrect!');
        }
        const token = await jwt.sign({ userId: user.id, email: user.email }, 'passw0rd?', {
            expiresIn: '1h'
        });
        return { userId: user.id, userRol: user.rol, token: token, tokenExpiration: 1}
    },
};

/* Example of login query */
/*
query {
  login(email: "kiara@test.com", password: "kiara1234"){
    userId
    userRol
    token
    tokenExpiration
  }
}
*/