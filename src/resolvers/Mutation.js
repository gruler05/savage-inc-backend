const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Mutation = {
    async signup(parent, args, ctx, info) {
        args.email = args.email.toLowerCase();
        //  hash the password
        const password = await bcrypt.hash(args.password, 10);
        const user = await ctx.db.mutation.createUser({
            ...args,
            password,
            permissions: { set: ['USER'] },
        }, info);
        //  info as a second argument to know what data to be returned to the client

        //  create a JWT token for them
        const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET);
        // We set a jwt as a cookie on the response
        ctx.response.cookie('token', token, {
            httpOnly: true,
            maxAge: 1000 * 60 * 60 *24 *365, // 1 year cookie
        });

        return user;
    }
};

module.exports = Mutation;