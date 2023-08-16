const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');
const AddedComment = require('../../Domains/comments/entities/AddedComment');
const CommentRepository = require('../../Domains/comments/CommentRepository');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');

class CommentRepositoryPostgres extends CommentRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addComment(addComment) {
    const { thread_id, owner, content } = addComment;
    const id = `comment-${this._idGenerator()}`;

    const query = {
      text: 'INSERT INTO comments VALUES($1, $2, $3, $4) RETURNING id, thread_id, content, owner, created_at, updated_at, deleted_at',
      values: [id, thread_id, owner, content],
    };

    const result = await this._pool.query(query);
    return new AddedComment({ ...result.rows[0] });
  }

  async getCommentsByThreadId(thread_id) {
    const query = {
      text: 'SELECT * FROM comments WHERE thread_id = $1',
      values: [thread_id],
    };

    const result = await this._pool.query(query);

    return result.rows;
  }

  async findCommentById(id) {
    const query = {
      text: 'SELECT * FROM comments WHERE id = $1',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('Komentar tidak ditemukan!');
    }

    return result.rows;
  }

  async verifyInThread({ id, thread_id }) {
    const query = {
      text: 'SELECT * FROM comments WHERE id = $1 AND thread_id = $2',
      values: [id, thread_id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('Komentar tidak ditemukan!');
    }
  }

  async verifyOwner({ id, owner }) {
    const query = {
      text: 'SELECT * FROM comments WHERE id = $1 AND owner = $2',
      values: [id, owner],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new AuthorizationError('Authorization error!');
    }
  }

  async softDeleteComment(id) {
    const query = {
      text: 'UPDATE comments SET deleted_at = NOW() WHERE id = $1',
      values: [id],
    };

    await this._pool.query(query);
  }

  async verifyCommentAvailability(id) {
    const query = {
      text: 'SELECT id FROM comments WHERE id = $1',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('Komentar tidak ditemukan');
    }
  }
}

module.exports = CommentRepositoryPostgres;
