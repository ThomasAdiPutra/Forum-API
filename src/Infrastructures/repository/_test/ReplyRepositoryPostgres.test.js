const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UserTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const RepliesTableTestHelper = require('../../../../tests/RepliesTableTestHelper');
const AddReply = require('../../../Domains/replies/entities/AddReply');
const AddedReply = require('../../../Domains/replies/entities/AddedReply');
const pool = require('../../database/postgres/pool');
const ReplyRepositoryPostgres = require('../ReplyRepositoryPostgres');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');

describe('ReplyRepositoryPostgres', () => {
  beforeAll(async () => {
    await UserTableTestHelper.addUser({});
    await ThreadsTableTestHelper.addThread({});
    await CommentsTableTestHelper.addComment({});
  });

  afterEach(async () => {
    await RepliesTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await UserTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await pool.end();
  });

  describe('addReply function', () => {
    it('should persist add reply and return added reply correctly', async () => {
      // Arrange
      const addReply = new AddReply({
        comment_id: 'comment-123',
        owner: 'user-123',
        content: 'Dicoding',
      });
      const fakeIdGenerator = () => '123'; // stub!
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      await replyRepositoryPostgres.addReply(addReply);

      // Assert
      const comment = await CommentsTableTestHelper.findCommentById('comment-123');
      expect(comment).toHaveLength(1);
    });

    it('should return added comment correctly', async () => {
      // Arrange
      const addReply = new AddReply({
        comment_id: 'comment-123',
        owner: 'user-123',
        content: 'Dicoding',
      });
      const fakeIdGenerator = () => '123'; // stub!
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const addedThread = await replyRepositoryPostgres.addReply(addReply);

      // Assert
      expect(addedThread).toStrictEqual(new AddedReply({
        id: 'reply-123',
        comment_id: 'comment-123',
        owner: 'user-123',
        content: 'Dicoding',
      }));
    });
  });

  describe('getRepliesByCommentId', () => {
    it('should return replies correctly', async () => {
      // Arrange
      await RepliesTableTestHelper.addReply({});
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      // Action
      const result = await replyRepositoryPostgres.getRepliesByCommentId('comment-123');

      // Assert
      expect(result).toHaveLength(1);
    });
  });

  describe('verifyInComment function', () => {
    it('should throw NotFoundError when reply is not in comment', async () => {
      const payload = {
        id: 'reply-123',
        comment_id: 'comment-123',
      };

      // Arrange
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(replyRepositoryPostgres.verifyInComment(payload))
        .rejects.toThrowError(NotFoundError);
    });

    it('should not throw NotFoundError when reply available', async () => {
      // Arrange
      await RepliesTableTestHelper.addReply({}); // memasukan balasan baru
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      const payload = {
        id: 'reply-123',
        comment_id: 'comment-123',
      };

      // Action & Assert
      await expect(replyRepositoryPostgres.verifyInComment(payload))
        .resolves.not.toThrowError(NotFoundError);
    });
  });

  describe('verifyOwner function', () => {
    it('should throw AuthorizationError when owner isn\'t active user', async () => {
      const payload = {
        id: 'reply-123',
        owner: 'user-123',
      };

      // Arrange
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(replyRepositoryPostgres.verifyOwner(payload))
        .rejects.toThrowError(AuthorizationError);
    });

    it('should not throw AuthorizationError when owner is active user', async () => {
      // Arrange
      await RepliesTableTestHelper.addReply({}); // memasukan balasan baru
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      const payload = {
        id: 'reply-123',
        owner: 'user-123',
      };

      // Action & Assert
      await expect(replyRepositoryPostgres.verifyOwner(payload))
        .resolves.not.toThrowError(AuthorizationError);
    });
  });

  describe('deleteComment function', () => {
    it('should soft delete reply', async () => {
      // Arrange
      const replyRepository = new ReplyRepositoryPostgres(pool);
      await RepliesTableTestHelper.addReply({});

      // Action
      await replyRepository.softDeleteReply('reply-123');

      // Assert
      const tokens = await RepliesTableTestHelper.findReplyById('reply-123');
      expect(tokens.deleted_at).not.toBeNull();
    });
  });
});
