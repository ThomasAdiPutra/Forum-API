/* eslint-disable camelcase */
exports.up = (pgm) => {
    pgm.createTable('threads', {
      id: {
        type: 'VARCHAR(50)',
        primaryKey: true,
      },
      owner: {
        type: 'VARCHAR(50)',
        notNull: true,
      },
      title: {
        type: 'TEXT',
        notNull: true,
      },
      body: {
        type: 'TEXT',
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

    pgm.addConstraint('threads', 'fk_threads.owner_users.id', 'FOREIGN KEY(owner) REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE');
  };
  
  exports.down = (pgm) => {
    pgm.dropConstraint('threads', 'fk_threads.owner_users.id');
    pgm.dropTable('threads');
  };
  