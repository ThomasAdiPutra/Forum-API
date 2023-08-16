const DetailComment = require('../../../Domains/comments/entities/DetailComment');
const DetailThread = require('../../../Domains/threads/entities/DetailThread');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const GetDetailThreadUseCase = require('../GetDetailThreadUseCase');
const UserRepository = require('../../../Domains/users/UserRepository');
const RegisteredUser = require('../../../Domains/users/entities/RegisteredUser');

describe('GetDetailThreadUseCase', () => {
  /**
   * Menguji apakah use case mampu mengoskestrasikan langkah demi langkah dengan benar.
   */
  it('should orchestrating the get detail thread action correctly', async () => {
    const threadId = 'thread-123';

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

    const mockUsername = 'John Doe';

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockUserRepository = new UserRepository();

    mockThreadRepository.getThreadById = jest.fn()
    .mockImplementation(() => Promise.resolve({
      id: 'thread-123',
      title: 'Dicoding',
      body: 'Dicoding Indonesia',
      created_at: new Date('2023-08-15T12:00:00.000Z'),
      username: 'John Doe',
    }));
    mockCommentRepository.getCommentsByThreadId = jest.fn()
    .mockImplementation(() => Promise.resolve([{
      id: 'comment-123',
      username: 'John Doe',
      created_at: new Date('2023-08-15T12:00:00.000Z'),
      content: 'Dicoding Indonesia',
      deleted_at: null,
    }]));
    mockUserRepository.getUsernameById = jest.fn()
    .mockImplementation(() => Promise.resolve(mockUsername));

    /** creating use case instance */
    const getThreadUseCase = new GetDetailThreadUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      userRepository: mockUserRepository,
    });

    // Action
    const detailThread = await getThreadUseCase.execute(threadId);

    // Assert
    expect(detailThread).toStrictEqual({...mockDetailThread, comments: mockDetailComment});

    expect(mockThreadRepository.getThreadById).toBeCalledWith(threadId);
    expect(mockCommentRepository.getCommentsByThreadId).toBeCalledWith(threadId);
  });

  // it('should not display comment\'s content when deleted_at contains value', async () => {
  //   const threadId = 'thread-123';

  //   const mockDetailThread = new DetailThread({
  //     id: 'thread-123',
  //     title: 'Dicoding',
  //     body: 'Dicoding Indonesia',
  //     created_at: new Date('2023-08-15T12:00:00.000Z'),
  //     username: 'John Doe',
  //   });

  //   const mockDetailComment = [new DetailComment({
  //     id: 'comment-123',
  //     username: 'John Doe',
  //     created_at: new Date('2023-08-15T12:00:00.000Z'),
  //     content: '**komentar telah dihapus**',
  //     deleted_at: new Date('2023-08-15T12:00:00.000Z'),
  //   })];

  //   const mockDetailUser = new RegisteredUser({
  //     id: 'user-123',
  //     username: 'John Doe',
  //     fullname: 'John Doe',
  //   });

  //   const mockThreadRepository = new ThreadRepository();
  //   const mockCommentRepository = new CommentRepository();
  //   const mockUserRepository = new UserRepository();

  //   mockThreadRepository.getThreadById = jest.fn()
  //   .mockImplementation(() => Promise.resolve(mockDetailThread));
  //   mockCommentRepository.getCommentsByThreadId = jest.fn()
  //   .mockImplementation(() => Promise.resolve(mockDetailComment));
  //   mockUserRepository.getUsernameById = jest.fn()
  //   .mockImplementation(() => Promise.resolve(mockDetailUser));

  //   /** creating use case instance */
  //   const getThreadUseCase = new GetDetailThreadUseCase({
  //     threadRepository: mockThreadRepository,
  //     commentRepository: mockCommentRepository,
  //     userRepository: mockUserRepository,
  //   });

  //   // Action
  //   const detailThread = await getThreadUseCase.execute(threadId);

  //   // Assert
  //   expect(detailThread).toStrictEqual({...mockDetailThread, comments: mockDetailComment});

  //   expect(mockThreadRepository.getThreadById).toBeCalledWith(threadId);
  //   expect(mockCommentRepository.getCommentsByThreadId).toBeCalledWith(threadId);
  // });
});