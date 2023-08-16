class AddedReply {
  constructor(payload) {
    this._verifyPayload(payload);

    const {
      id, comment_id, owner, content,
    } = payload;

    this.id = id;
    this.commentId = comment_id;
    this.owner = owner;
    this.content = content;
  }

  _verifyPayload({
    id, comment_id, owner, content,
  }) {
    if (!id || !comment_id || !owner || !content) {
      throw new Error('ADDED_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof id !== 'string' || typeof comment_id !== 'string' || typeof owner !== 'string' || typeof content !== 'string') {
      throw new Error('ADDED_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = AddedReply;
