const DetailComment = require('../../../Domains/comments/entities/DetailComment');
const DetailThread = require('../../../Domains/threads/entities/DetailThread');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ReplyRepository = require('../../../Domains/replies/ReplyRepository');
const GetDetailThreadUseCase = require('../GetDetailThreadUseCase');
const UserRepository = require('../../../Domains/users/UserRepository');
const DetailReply = require('../../../Domains/replies/entities/DetailReply');

describe('GetDetailThreadUseCase', () => {
  /**
   * Menguji apakah use case mampu mengoskestrasikan langkah demi langkah dengan benar.
   */
  it('should orchestrating the get detail thread action correctly', async () => {
    const owner = 'user-123';
    const threadId = 'thread-123';
    const commentId = 'comment-123';

    const mockDetailThread = new DetailThread({
      id: 'thread-123',
      title: 'Dicoding',
      body: 'Dicoding Indonesia',
      created_at: new Date('2023-08-15T12:00:00.000Z'),
      username: 'John Doe',
    });

    const mockDetailComment = [new DetailComment({
      id: 'comment-123',
      username: 'John Doe',
      created_at: new Date('2023-08-15T12:00:00.000Z'),
      content: 'Dicoding Indonesia',
      deleted_at: null,
    })];

    const mockDetailReplies = [
      new DetailReply({
        id: 'reply-123',
        username: 'John Doe',
        created_at: new Date('2023-08-15T12:00:00.000Z'),
        content: 'Dicoding Indonesia',
        deleted_at: null,
      }),
    ];

    const mockUsername = 'John Doe';

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();
    const mockUserRepository = new UserRepository();

    mockThreadRepository.getThreadById = jest.fn()
      .mockImplementation(() => Promise.resolve({
        id: 'thread-123',
        owner: 'user-123',
        title: 'Dicoding',
        body: 'Dicoding Indonesia',
        created_at: new Date('2023-08-15T12:00:00.000Z'),
        updated_at: new Date('2023-08-15T12:00:00.000Z'),
        deleted_at: null,
      }));
    mockCommentRepository.getCommentsByThreadId = jest.fn()
      .mockImplementation(() => Promise.resolve([{
        id: 'comment-123',
        thread_id: 'thread-123',
        owner: 'user-123',
        content: 'Dicoding Indonesia',
        created_at: new Date('2023-08-15T12:00:00.000Z'),
        updated_at: new Date('2023-08-15T12:00:00.000Z'),
        deleted_at: null,
      }]));
    mockReplyRepository.getRepliesByCommentId = jest.fn()
      .mockImplementation(() => Promise.resolve([{
        id: 'reply-123',
        comment_id: 'comment-123',
        owner: 'user-123',
        content: 'Dicoding Indonesia',
        created_at: new Date('2023-08-15T12:00:00.000Z'),
        updated_at: new Date('2023-08-15T12:00:00.000Z'),
        deleted_at: null,
      }]));
    mockUserRepository.getUsernameById = jest.fn()
      .mockImplementation(() => Promise.resolve(mockUsername));

    /** creating use case instance */
    const getThreadUseCase = new GetDetailThreadUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
      userRepository: mockUserRepository,
    });

    // Action
    const detailThread = await getThreadUseCase.execute(threadId);

    const comments = mockDetailComment;
    comments[0].replies = mockDetailReplies;

    // Assert
    expect(detailThread).toStrictEqual({ ...mockDetailThread, comments });

    expect(mockThreadRepository.getThreadById).toBeCalledWith(threadId);
    expect(mockCommentRepository.getCommentsByThreadId).toBeCalledWith(threadId);
    expect(mockReplyRepository.getRepliesByCommentId).toBeCalledWith(commentId);
    expect(mockUserRepository.getUsernameById).toBeCalledWith(owner);
  });

  it('should not display comment\'s content when deleted_at contains value', async () => {
    const owner = 'user-123';
    const threadId = 'thread-123';
    const commentId = 'comment-123';

    const mockDetailThread = new DetailThread({
      id: 'thread-123',
      title: 'Dicoding',
      body: 'Dicoding Indonesia',
      created_at: new Date('2023-08-15T12:00:00.000Z'),
      username: 'John Doe',
    });

    const mockDetailComment = [new DetailComment({
      id: 'comment-123',
      username: 'John Doe',
      created_at: new Date('2023-08-15T12:00:00.000Z'),
      content: '**komentar telah dihapus**',
      deleted_at: new Date('2023-08-15T12:00:00.000Z'),
    })];

    const mockDetailReplies = [
      new DetailReply({
        id: 'reply-123',
        username: 'John Doe',
        created_at: new Date('2023-08-15T12:00:00.000Z'),
        content: '**balasan telah dihapus**',
        deleted_at: null,
      }),
    ];

    const mockUsername = 'John Doe';

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();
    const mockUserRepository = new UserRepository();

    mockThreadRepository.getThreadById = jest.fn()
      .mockImplementation(() => Promise.resolve({
        id: 'thread-123',
        owner: 'user-123',
        title: 'Dicoding',
        body: 'Dicoding Indonesia',
        created_at: new Date('2023-08-15T12:00:00.000Z'),
        updated_at: new Date('2023-08-15T12:00:00.000Z'),
        deleted_at: null,
      }));

    mockCommentRepository.getCommentsByThreadId = jest.fn()
      .mockImplementation(() => Promise.resolve([{
        id: 'comment-123',
        thread_id: 'thread-123',
        owner: 'user-123',
        content: 'Dicoding',
        created_at: new Date('2023-08-15T12:00:00.000Z'),
        updated_at: new Date('2023-08-15T12:00:00.000Z'),
        deleted_at: new Date('2023-08-15T12:00:00.000Z'),
      }]));

    mockReplyRepository.getRepliesByCommentId = jest.fn()
      .mockImplementation(() => Promise.resolve([{
        id: 'reply-123',
        comment_id: 'comment-123',
        owner: 'user-123',
        content: 'Dicoding Indonesia',
        created_at: new Date('2023-08-15T12:00:00.000Z'),
        updated_at: new Date('2023-08-15T12:00:00.000Z'),
        deleted_at: new Date('2023-08-15T12:00:00.000Z'),
      }]));
    mockUserRepository.getUsernameById = jest.fn()
      .mockImplementation(() => Promise.resolve(mockUsername));

    /** creating use case instance */
    const getThreadUseCase = new GetDetailThreadUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
      userRepository: mockUserRepository,
    });

    const comments = mockDetailComment;
    comments[0].replies = mockDetailReplies;

    // Action
    const detailThread = await getThreadUseCase.execute(threadId);

    // Assert
    expect(detailThread).toStrictEqual({ ...mockDetailThread, comments });

    expect(mockThreadRepository.getThreadById).toBeCalledWith(threadId);
    expect(mockCommentRepository.getCommentsByThreadId).toBeCalledWith(threadId);
    expect(mockReplyRepository.getRepliesByCommentId).toBeCalledWith(commentId);
    expect(mockUserRepository.getUsernameById).toBeCalledWith(owner);
  });
});
