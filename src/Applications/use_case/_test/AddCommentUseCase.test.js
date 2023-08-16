const AddedComment = require('../../../Domains/comments/entities/AddedComment');
const AddComment = require('../../../Domains/comments/entities/AddComment');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const AddCommentUseCase = require('../AddCommentUseCase');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');

describe('AddCommentUseCase', () => {
  /**
   * Menguji apakah use case mampu mengoskestrasikan langkah demi langkah dengan benar.
   */
  it('should orchestrating the add comment action correctly', async () => {
    const useCasePayload = {
      thread_id: 'thread-123',
      owner: 'user-123',
      content: 'Dicoding',
    };

    const mockAddedComment = new AddedComment({
      id: 'comment-123',
      thread_id: useCasePayload.thread_id,
      owner: useCasePayload.owner,
      content: useCasePayload.content,
    });

    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();

    mockCommentRepository.addComment = jest.fn()
      .mockImplementation(() => Promise.resolve(mockAddedComment));
    mockThreadRepository.verifyThreadAvailability = jest.fn()
      .mockImplementation(() => Promise.resolve());

    /** creating use case instance */
    const getCommentUseCase = new AddCommentUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    // Action
    const addedComment = await getCommentUseCase.execute(useCasePayload);

    // Assert
    expect(addedComment).toStrictEqual(new AddedComment({
      id: 'comment-123',
      thread_id: useCasePayload.thread_id,
      owner: useCasePayload.owner,
      content: useCasePayload.content,
    }));

    expect(mockCommentRepository.addComment).toBeCalledWith(new AddComment({
      thread_id: useCasePayload.thread_id,
      owner: useCasePayload.owner,
      content: useCasePayload.content,
    }));

    expect(mockThreadRepository.verifyThreadAvailability).toBeCalledWith(useCasePayload.thread_id);
  });
});
