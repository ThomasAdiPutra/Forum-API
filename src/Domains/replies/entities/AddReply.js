class AddReply {
  constructor(payload) {
    this._verifyPayload(payload);

    const { comment_id, owner, content } = payload;

    this.comment_id = comment_id;
    this.owner = owner;
    this.content = content;
  }

  _verifyPayload({ comment_id, owner, content }) {
    if (!comment_id || !owner || !content) {
      throw new Error('ADD_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof comment_id !== 'string' || typeof owner !== 'string' || typeof content !== 'string') {
      throw new Error('ADD_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = AddReply;
