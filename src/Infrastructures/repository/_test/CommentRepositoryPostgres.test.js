const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UserTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const AddComment = require('../../../Domains/comments/entities/AddComment');
const AddedComment = require('../../../Domains/comments/entities/AddedComment');
const pool = require('../../database/postgres/pool');
const CommentRepositoryPostgres = require('../CommentRepositoryPostgres');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');

describe('CommentRepositoryPostgres', () => {
  beforeAll(async () => {
    await UserTableTestHelper.addUser({});
    await ThreadsTableTestHelper.addThread({});
  });

  afterEach(async () => {
    await CommentsTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await UserTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await pool.end();
  });

  describe('addComment function', () => {
    it('should persist add comment and return added comment correctly', async () => {
      // Arrange
      const addComment = new AddComment({
        thread_id: 'thread-123',
        owner: 'user-123',
        content: 'Dicoding',
      });
      const fakeIdGenerator = () => '123'; // stub!
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      await commentRepositoryPostgres.addComment(addComment);

      // Assert
      const comment = await CommentsTableTestHelper.findCommentById('comment-123');
      expect(comment).toHaveLength(1);
    });

    it('should return added comment correctly', async () => {
      // Arrange
      const addComment = new AddComment({
        thread_id: 'thread-123',
        owner: 'user-123',
        content: 'Dicoding',
      });
      const fakeIdGenerator = () => '123'; // stub!
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const addedComment = await commentRepositoryPostgres.addComment(addComment);

      // Assert
      expect(addedComment).toStrictEqual(new AddedComment({
        id: 'comment-123',
        thread_id: 'thread-123',
        owner: 'user-123',
        content: 'Dicoding',
      }));
    });
  });

  describe('getCommentsByThreadId function', () => {
    it('should return comments correctly', async () => {
      // Arrange
      const expectedComment = await CommentsTableTestHelper.addComment({
        id: 'comment-123', owner: 'user-123', thread_id: 'thread-123', content: 'Dicoding',
      });
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action
      const comment = await commentRepositoryPostgres.getCommentsByThreadId('thread-123');

      // Assert
      expect(comment).toStrictEqual([expectedComment]);
    });
  });

  describe('findCommentById function', () => {
    it('Should throw NotFoundError when comment is not available', async () => {
      const id = 'comment-123';

      // Arrange
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(commentRepositoryPostgres.findCommentById(id))
        .rejects.toThrowError(NotFoundError);
    });

    it('Should not throw NotFoundError when comment is available', async () => {
      await CommentsTableTestHelper.addComment({});
      const id = 'comment-123';

      // Arrange
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(commentRepositoryPostgres.findCommentById(id))
        .resolves.not.toThrowError(NotFoundError);
    });
  });

  describe('verifyInThread function', () => {
    it('should throw NotFoundError when comment is not in thread', async () => {
      const payload = {
        id: 'comment-123',
        thread_id: 'thread-123',
      };

      // Arrange
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(commentRepositoryPostgres.verifyInThread(payload))
        .rejects.toThrowError(NotFoundError);
    });

    it('should not throw NotFoundError when reply available', async () => {
      // Arrange
      await CommentsTableTestHelper.addComment({}); // memasukan komentar baru
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      const payload = {
        id: 'comment-123',
        thread_id: 'thread-123',
      };

      // Action & Assert
      await expect(commentRepositoryPostgres.verifyInThread(payload))
        .resolves.not.toThrowError(NotFoundError);
    });
  });

  describe('verifyOwner function', () => {
    it('should throw AuthorizationError when owner isn\'t active user', async () => {
      const payload = {
        id: 'comment-123',
        owner: 'user-123',
      };

      // Arrange
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(commentRepositoryPostgres.verifyOwner(payload))
        .rejects.toThrowError(AuthorizationError);
    });

    it('should not throw AuthorizationError when owner is active user', async () => {
      // Arrange
      await CommentsTableTestHelper.addComment({}); // memasukan komentar baru
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      const payload = {
        id: 'comment-123',
        owner: 'user-123',
      };

      // Action & Assert
      await expect(commentRepositoryPostgres.verifyOwner(payload))
        .resolves.not.toThrowError(AuthorizationError);
    });
  });

  describe('deleteComment function', () => {
    it('should soft delete comment', async () => {
      // Arrange
      const commentRepository = new CommentRepositoryPostgres(pool);
      await CommentsTableTestHelper.addComment({});

      // Action
      await commentRepository.softDeleteComment('comment-123');

      // Assert
      const tokens = await CommentsTableTestHelper.findCommentById('comment-123');
      expect(tokens.deleted_at).not.toBeNull();
    });
  });

  describe('verifyCommentAvailability function', () => {
    it('should throw NotFoundError when comment not available', async () => {
      // Arrange
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(commentRepositoryPostgres.verifyCommentAvailability('comment-123')).rejects.toThrowError(NotFoundError);
    });

    it('should not throw NotFoundError when comment available', async () => {
      // Arrange
      await CommentsTableTestHelper.addComment({}); // memasukan komentar baru
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(commentRepositoryPostgres.verifyCommentAvailability('comment-123')).resolves.not.toThrowError(NotFoundError);
    });
  });
});
