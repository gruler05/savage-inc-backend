const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Mutation = {
  async signup(parent, args, ctx, info) {
    args.email = args.email.toLowerCase();
    //  hash the password
    const password = await bcrypt.hash(args.password, 10);
    const user = await ctx.db.mutation.createUser({
      data: {
        ...args,
        password,
        permissions: {
          set: ['USER']
        },
      }
    }, info);
    //  info as a second argument to know what data to be returned to the client

    //  create a JWT token for them
    const token = jwt.sign({
      userId: user.id
    }, process.env.APP_SECRET);
    // We set a jwt as a cookie on the response
    ctx.response.cookie('token', token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 365, // 1 year cookie
    });

    return user;
  },
  async signin(parent, {
    email,
    password
  }, ctx, info) {
    //  check if a user already exist
    const user = await ctx.db.query.user({
      where: {
        email
      }
    });
    if (!user) {
      throw new Error(`No such user found for ${email}`);
    }
    // check if the password is correct
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      throw new Error('Invalid Password');
    }
    // set the jwt token
    const token = jwt.sign({
      userId: user.id
    }, process.env.APP_SECRET);
    ctx.response.cookie('token', token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 365, // 1 year cookie
    });
    return user;
  },
  signout(parent, args, ctx, info) {
    ctx.response.clearCookie('token');
    return {
      message: 'Successfully logged out'
    };
  }
};

module.exports = Mutation;
