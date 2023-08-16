/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const ThreadsTableTestHelper = {
  async addThread({
    id = 'thread-123', owner = 'user-123', title = 'Dicoding', body = 'Dicoding Indonesia',
  }) {
    const query = {
      text: 'INSERT INTO threads VALUES($1, $2, $3, $4) RETURNING id, owner, title, body, created_at, updated_at, deleted_at',
      values: [id, owner, title, body],
    };

    const result = await pool.query(query);

    return result.rows[0];
  },

  async findThreadById(id) {
    const query = {
      text: 'SELECT * FROM threads WHERE id = $1',
      values: [id],
    };

    const result = await pool.query(query);
    return result.rows;
  },

  async cleanTable() {
    await pool.query('DELETE FROM threads WHERE 1=1');
  },
};

module.exports = ThreadsTableTestHelper;
