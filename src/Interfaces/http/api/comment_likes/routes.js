const routes = (handler) => ([
  {
    method: 'PUT',
    path: '/threads/{thread_id}/comments/{comment_id}/likes',
    handler: handler.putLikeHandler,
    options: {
      auth: 'forum_api_jwt',
    },
  },
]);

module.exports = routes;
