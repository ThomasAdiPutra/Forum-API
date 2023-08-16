class AddComment {
  constructor(payload) {
    this._verifyPayload(payload);

    const { thread_id, owner, content } = payload;

    this.thread_id = thread_id;
    this.owner = owner;
    this.content = content;
  }

  _verifyPayload({ thread_id, owner, content }) {
    if (!thread_id || !owner || !content) {
      throw new Error('ADD_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof thread_id !== 'string' || typeof owner !== 'string' || typeof content !== 'string') {
      throw new Error('ADD_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = AddComment;
