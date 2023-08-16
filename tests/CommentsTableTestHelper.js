/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const CommentsTableTestHelper = {
  async addComment({
    id = 'comment-123', thread_id = 'thread-123', owner = 'user-123', content = 'Dicoding',
  }) {
    const query = {
      text: 'INSERT INTO comments VALUES($1, $2, $3, $4) RETURNING id, thread_id, owner, content, created_at, updated_at, deleted_at',
      values: [id, thread_id, owner, content],
    };

    const result = await pool.query(query);

    return result.rows[0];
  },

  async findCommentById(id) {
    const query = {
      text: 'SELECT * FROM comments WHERE id = $1',
      values: [id],
    };

    const result = await pool.query(query);
    return result.rows;
  },

  async cleanTable() {
    await pool.query('DELETE FROM comments WHERE 1=1');
  },
};

module.exports = CommentsTableTestHelper;
