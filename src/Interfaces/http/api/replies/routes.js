const routes = (handler) => ([
  {
    method: 'POST',
    path: '/threads/{thread_id}/comments/{comment_id}/replies',
    handler: handler.postReplyHandler,
    options: {
      auth: 'forum_api_jwt',
    },
  },
  {
    method: 'DELETE',
    path: '/threads/{thread_id}/comments/{comment_id}/replies/{id}',
    handler: handler.deleteReplyHandler,
    options: {
      auth: 'forum_api_jwt',
    },
  },
]);

module.exports = routes;
