const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ReplyRepository = require('../../../Domains/replies/ReplyRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const DeleteReplyUseCase = require('../DeleteReplyUseCase');

describe('DeleteReplyUseCase', () => {
  it('should throw error when payload did not contain needed property', async () => {
    // Arrange
    const useCasePayload = {
      id: 'reply-123',
      comment_id: 'comment-123',
      thread_id: 'thread-123',
    };

    const deleteReplyUseCase = new DeleteReplyUseCase({});

    // Action & Assert
    await expect(deleteReplyUseCase.execute(useCasePayload))
      .rejects
      .toThrowError('DELETE_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', async () => {
    // Arrange
    const useCasePayload = {
      id: 'reply-123',
      comment_id: 'comment-123',
      thread_id: 'thread-123',
      owner: true,
    };
    const deleteReplyUseCase = new DeleteReplyUseCase({});

    // Action & Assert
    await expect(deleteReplyUseCase.execute(useCasePayload))
      .rejects
      .toThrowError('DELETE_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should orchestrating the delete reply action correctly', async () => {
    // Arrange
    const useCasePayload = {
      id: 'reply-123',
      comment_id: 'comment-123',
      thread_id: 'thread-123',
      owner: 'user-123',
    };

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();

    mockThreadRepository.verifyThreadAvailability = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.verifyCommentAvailability = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.verifyInThread = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockReplyRepository.verifyInComment = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockReplyRepository.verifyOwner = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockReplyRepository.softDeleteReply = jest.fn()
      .mockImplementation(() => Promise.resolve());

    mockCommentRepository.verifyInThread = jest.fn()
      .mockImplementation(() => Promise.resolve());

    const deleteReplyUseCase = new DeleteReplyUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
    });

    // Act
    await deleteReplyUseCase.execute(useCasePayload);

    // Assert
    expect(mockThreadRepository.verifyThreadAvailability)
      .toHaveBeenCalledWith(useCasePayload.thread_id);
    expect(mockCommentRepository.verifyCommentAvailability)
      .toHaveBeenCalledWith(useCasePayload.comment_id);
    expect(mockCommentRepository.verifyInThread)
      .toHaveBeenCalledWith({
        id: useCasePayload.comment_id, thread_id: useCasePayload.thread_id,
      });
    expect(mockReplyRepository.verifyInComment)
      .toHaveBeenCalledWith({ id: useCasePayload.id, comment_id: useCasePayload.comment_id });
    expect(mockReplyRepository.verifyOwner)
      .toHaveBeenCalledWith({ id: useCasePayload.id, owner: useCasePayload.owner });
    expect(mockReplyRepository.softDeleteReply)
      .toHaveBeenCalledWith(useCasePayload.id);
  });
});
