const Query = {
    me(parent, args, ctx, info) {
        // check if there is a current user id
        if (!ctx.request.userId) {
            return null;
        }
        return ctx.db.query.user({
            where: {
                id: ctx.request.userId
            }
        }, info)
    }
};

module.exports = Query;