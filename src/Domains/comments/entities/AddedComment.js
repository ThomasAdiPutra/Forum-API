class AddedComment {
  constructor(payload) {
    this._verifyPayload(payload);

    const {
      id, thread_id, owner, content,
    } = payload;

    this.id = id;
    this.threadId = thread_id;
    this.owner = owner;
    this.content = content;
  }

  _verifyPayload({
    id, thread_id, owner, content,
  }) {
    if (!id || !thread_id || !owner || !content) {
      throw new Error('ADDED_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof id !== 'string' || typeof thread_id !== 'string' || typeof owner !== 'string' || typeof content !== 'string') {
      throw new Error('ADDED_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = AddedComment;
