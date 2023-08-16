const AddedReply = require('../../../Domains/replies/entities/AddedReply');
const AddReply = require('../../../Domains/replies/entities/AddReply');
const ReplyRepository = require('../../../Domains/replies/ReplyRepository');
const AddReplyUseCase = require('../AddReplyUseCase');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');

describe('AddReplyUseCase', () => {
  /**
   * Menguji apakah use case mampu mengoskestrasikan langkah demi langkah dengan benar.
   */
  it('should orchestrating the add reply action correctly', async () => {
    const useCasePayload = {
      comment_id: 'comment-123',
      thread_id: 'thread-123',
      owner: 'user-123',
      content: 'Dicoding',
    };

    const mockAddedReply = new AddedReply({
      id: 'reply-123',
      comment_id: 'comment-123',
      thread_id: useCasePayload.thread_id,
      owner: useCasePayload.owner,
      content: useCasePayload.content,
    });

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();

    mockThreadRepository.verifyThreadAvailability = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.verifyCommentAvailability = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.verifyInThread = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockReplyRepository.addReply = jest.fn()
      .mockImplementation(() => Promise.resolve(mockAddedReply));

    /** creating use case instance */
    const getReplyUseCase = new AddReplyUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
    });

    // Action
    const addedReply = await getReplyUseCase.execute(useCasePayload);

    // Assert
    expect(mockThreadRepository.verifyThreadAvailability)
      .toHaveBeenCalledWith(useCasePayload.thread_id);
    expect(mockCommentRepository.verifyCommentAvailability)
      .toHaveBeenCalledWith(useCasePayload.comment_id);
    expect(mockCommentRepository.verifyInThread)
      .toHaveBeenCalledWith({
        id: useCasePayload.comment_id, thread_id: useCasePayload.thread_id,
      });

    expect(addedReply).toStrictEqual(new AddedReply({
      id: 'reply-123',
      comment_id: 'comment-123',
      thread_id: useCasePayload.thread_id,
      owner: useCasePayload.owner,
      content: useCasePayload.content,
    }));

    expect(mockReplyRepository.addReply).toBeCalledWith(new AddReply({
      comment_id: useCasePayload.comment_id,
      owner: useCasePayload.owner,
      content: useCasePayload.content,
    }));
  });
});
