/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const RepliesTableTestHelper = {
  async addReply({
    id = 'reply-123', comment_id = 'comment-123', owner = 'user-123', content = 'Dicoding',
  }) {
    const query = {
      text: 'INSERT INTO replies VALUES($1, $2, $3, $4) RETURNING id, comment_id, owner, content, created_at, updated_at, deleted_at',
      values: [id, comment_id, owner, content],
    };

    const result = await pool.query(query);

    return result.rows[0];
  },

  async findReplyById(id) {
    const query = {
      text: 'SELECT * FROM replies WHERE id = $1',
      values: [id],
    };

    const result = await pool.query(query);
    return result.rows;
  },

  async cleanTable() {
    await pool.query('DELETE FROM replies WHERE 1=1');
  },
};

module.exports = RepliesTableTestHelper;
