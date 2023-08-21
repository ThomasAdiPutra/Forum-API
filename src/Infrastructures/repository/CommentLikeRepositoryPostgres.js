const CommentLikeRepository = require('../../Domains/comment_likes/CommentLikeRepository');

class CommentLikeRepositoryPostgres extends CommentLikeRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addLike(addLike) {
    const { comment_id, owner } = addLike;
    const id = `like-${this._idGenerator()}`;

    const query = {
      text: 'INSERT INTO comment_likes VALUES($1, $2, $3)',
      values: [id, comment_id, owner],
    };

    await this._pool.query(query);
  }

  async softDeleteLike(deleteLike) {
    const { comment_id, owner } = deleteLike;

    const query = {
      text: 'UPDATE comment_likes SET deleted_at = NOW() WHERE comment_id = $1 AND owner = $2',
      values: [comment_id, owner],
    };

    await this._pool.query(query);
  }

  async findLikeByCommentOwnerId(findLike) {
    const { comment_id, owner } = findLike;
    const query = {
      text: 'SELECT id, comment_id, owner FROM comment_likes WHERE comment_id = $1 AND owner = $2 AND deleted_at IS NULL',
      values: [comment_id, owner],
    };

    const result = await this._pool.query(query);

    return result.rows;
  }

  async getLikeCountByCommentId(comment_id) {
    const query = {
      text: 'SELECT COUNT(*) as likeCount FROM comment_likes WHERE comment_id = $1 AND deleted_at IS NULL GROUP BY comment_id',
      values: [comment_id],
    };

    const result = await this._pool.query(query);

    if (result.rows.length === 0) {
      return 0;
    }
    const { likecount } = result.rows[0];
    return +likecount;
  }
}

module.exports = CommentLikeRepositoryPostgres;
