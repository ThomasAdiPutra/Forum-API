/* eslint-disable camelcase */
exports.up = (pgm) => {
  pgm.createTable('comment_likes', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    comment_id: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    owner: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    created_at: {
      type: 'timestamp',
      default: pgm.func('current_timestamp'),
    },
    updated_at: {
      type: 'timestamp',
      default: pgm.func('current_timestamp'),
    },
    deleted_at: {
      type: 'timestamp',
    },
  });

  pgm.addConstraint('comment_likes', 'fk_comment_likes.comment_id_comments.id', 'FOREIGN KEY(comment_id) REFERENCES comments(id) ON UPDATE CASCADE ON DELETE CASCADE');
  pgm.addConstraint('comment_likes', 'fk_comment_likes.owner_users.id', 'FOREIGN KEY(owner) REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE');
};

exports.down = (pgm) => {
  pgm.dropConstraint('comment_likes', 'fk_comment_likes.comment_id_comments.id');
  pgm.dropConstraint('comment_likes', 'fk_comment_likes.owner_users.id');
  pgm.dropTable('comment_likes');
};
