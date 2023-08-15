const CommentRepository = require('../../../Domains/comments/CommentRepository');
const DeleteCommentUseCase = require('../DeleteCommentUseCase');

describe('DeleteCommentUseCase', () => {
  it('should throw error when payload did not contain needed property', async () => {
    // Arrange
    const useCasePayload = {
        id: 'comment-123',
        thread_id: 'thread-123',
    };

    const deleteCommentUseCase = new DeleteCommentUseCase({});

    // Action & Assert
    await expect(deleteCommentUseCase.execute(useCasePayload))
      .rejects
      .toThrowError('DELETE_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', async () => {
    // Arrange
    const useCasePayload = {
        id: 'comment-123',
        thread_id: 'thread-123',
        owner: true,
    };
    const deleteCommentUseCase = new DeleteCommentUseCase({});

    // Action & Assert
    await expect(deleteCommentUseCase.execute(useCasePayload))
      .rejects
      .toThrowError('DELETE_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should orchestrating the delete authentication action correctly', async () => {
    // Arrange
    const useCasePayload = {
        id: 'comment-123',
        thread_id: 'thread-123',
        owner: 'user-123',
    };

    const mockCommentRepository = new CommentRepository();
    mockCommentRepository.verifyInThread = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.verifyOwner = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.softDeleteComment = jest.fn()
      .mockImplementation(() => Promise.resolve());

    const deleteCommentUseCase = new DeleteCommentUseCase({
      commentRepository: mockCommentRepository,
    });

    // Act
    await deleteCommentUseCase.execute(useCasePayload);

    // Assert
    expect(mockCommentRepository.verifyInThread)
      .toHaveBeenCalledWith({id: useCasePayload.id, thread_id: useCasePayload.thread_id});
    expect(mockCommentRepository.verifyOwner)
      .toHaveBeenCalledWith({id: useCasePayload.id, owner: useCasePayload.owner});
    expect(mockCommentRepository.softDeleteComment)
      .toHaveBeenCalledWith(useCasePayload.id);
  });
});
