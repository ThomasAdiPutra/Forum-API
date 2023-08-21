class DetailComment {
  constructor(payload) {
    this._verifyPayload(payload);

    const {
      id, username, created_at: date, content, likeCount,
    } = payload;

    this.id = id;
    this.username = username;
    this.date = date;
    this.content = content;
    this.likeCount = likeCount;
  }

  _verifyPayload({
    id, username, created_at: date, content, likeCount,
  }) {
    // eslint-disable-next-line no-restricted-globals
    if (!id || !username || !date || !content || (!likeCount && isNaN(likeCount))) {
      throw new Error('DETAIL_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof id !== 'string' || typeof username !== 'string' || typeof date !== 'object' || typeof content !== 'string' || typeof likeCount !== 'number') {
      throw new Error('DETAIL_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = DetailComment;
