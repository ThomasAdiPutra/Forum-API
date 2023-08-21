const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UserTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const CommentLikesTableTestHelper = require('../../../../tests/CommentLikesTableTestHelper');
const pool = require('../../database/postgres/pool');
const CommentLikeRepositoryPostgres = require('../CommentLikeRepositoryPostgres');

describe('CommentLikeRepositoryPostgres', () => {
  beforeEach(() => {
    jest.setTimeout(20000);
  });

  beforeAll(async () => {
    await UserTableTestHelper.addUser({});
    await ThreadsTableTestHelper.addThread({});
    await CommentsTableTestHelper.addComment({});
  });

  afterEach(async () => {
    await CommentLikesTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await UserTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await pool.end();
  });

  describe('addLike function', () => {
    it('should persist add like and return like correctly', async () => {
      // Arrange
      const addLike = {
        id: 'like-123',
        comment_id: 'comment-123',
        owner: 'user-123',
      };

      const fakeIdGenerator = () => '123'; // stub!
      const commentLikeRepositoryPostgres = new CommentLikeRepositoryPostgres(
        pool,
        fakeIdGenerator,
      );

      // Action
      await commentLikeRepositoryPostgres.addLike(addLike);

      // Assert
      const like = await CommentLikesTableTestHelper.findLikeByCommentOwnerId(addLike);
      expect(like[0]).toStrictEqual(addLike);
    });
  });

  describe('softDeleteLike function', () => {
    it('should delete like if comment already liked', async () => {
      // Arrange
      CommentLikesTableTestHelper.addLike({});
      const fakeIdGenerator = () => '123'; // stub!
      const replyRepositoryPostgres = new CommentLikeRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      await replyRepositoryPostgres.softDeleteLike({
        comment_id: 'comment-123', owner: 'user-123',
      });

      // Assert
      const like = await CommentLikesTableTestHelper.findLikeByCommentOwnerId({
        comment_id: 'comment-123', owner: 'user-123',
      });

      expect(like).toHaveLength(0);
    });
  });

  describe('findLikeByCommentOwnerId function', () => {
    it('should return replies correctly', async () => {
      const expectedValue = {
        id: 'like-123',
        comment_id: 'comment-123',
        owner: 'user-123',
      };

      // Arrange
      await CommentLikesTableTestHelper.addLike({});
      const commentLikeRepositoryPostgres = new CommentLikeRepositoryPostgres(pool, {});

      // Action
      const result = await commentLikeRepositoryPostgres.findLikeByCommentOwnerId({
        comment_id: 'comment-123', owner: 'user-123',
      });

      // Assert
      expect(result[0]).toStrictEqual(expectedValue);
    });
  });
});
