const AddedThread = require('../../../Domains/threads/entities/AddedThread');
const AddThread = require('../../../Domains/threads/entities/AddThread');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const AddThreadUseCase = require('../AddThreadUseCase');

describe('AddThreadUseCase', () => {
  /**
   * Menguji apakah use case mampu mengoskestrasikan langkah demi langkah dengan benar.
   */
  it('should orchestrating the add thread action correctly', async () => {
    const useCasePayload = {
      owner: 'user-123',
      title: 'Dicoding',
      body: 'Dicoding Indonesia',
    };

    const mockAddedThread = new AddedThread({
      id: 'thread-123',
      owner: useCasePayload.owner,
      title: useCasePayload.title,
      body: useCasePayload.body,
    });

    const mockThreadRepository = new ThreadRepository();

    mockThreadRepository.addThread = jest.fn()
    .mockImplementation(() => Promise.resolve(mockAddedThread));

    /** creating use case instance */
    const getThreadUseCase = new AddThreadUseCase({
      threadRepository: mockThreadRepository,
    });

    // Action
    const addedThread = await getThreadUseCase.execute(useCasePayload);

    // Assert
    expect(addedThread).toStrictEqual(new AddedThread({
      id: 'thread-123',
      owner: useCasePayload.owner,
      title: useCasePayload.title,
      body: useCasePayload.body,
    }));

    expect(mockThreadRepository.addThread).toBeCalledWith(new AddThread({
      owner: useCasePayload.owner,
      title: useCasePayload.title,
      body: useCasePayload.body,
    }));
  });
});