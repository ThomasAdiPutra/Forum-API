/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const CommentLikesTableTestHelper = {
  async addLike({
    id = 'like-123', comment_id = 'comment-123', owner = 'user-123',
  }) {
    const query = {
      text: 'INSERT INTO comment_likes VALUES($1, $2, $3)',
      values: [id, comment_id, owner],
    };

    await pool.query(query);
  },

  async softDeleteLike({
    comment_id = 'comment-123', owner = 'user-123',
  }) {
    const query = {
      text: 'UPDATE comment_likes SET deleted_at = NOW() WHERE comment_id = $1 AND owner = $2',
      values: [comment_id, owner],
    };

    await pool.query(query);
  },

  async findLikeByCommentOwnerId({ comment_id, owner }) {
    const query = {
      text: 'SELECT id, comment_id, owner FROM comment_likes WHERE comment_id = $1 AND owner = $2 AND deleted_at IS NULL',
      values: [comment_id, owner],
    };

    const result = await pool.query(query);
    return result.rows;
  },

  async cleanTable() {
    await pool.query('DELETE FROM comment_likes WHERE 1=1');
  },
};

module.exports = CommentLikesTableTestHelper;
