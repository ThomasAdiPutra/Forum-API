const CommentLikesHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'commentLike',
  register: async (server, { container }) => {
    const commentLikeHandler = new CommentLikesHandler(container);
    server.route(routes(commentLikeHandler));
  },
};
