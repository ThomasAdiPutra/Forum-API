const AddComment = require('../AddComment');

describe('a AddComment entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      content: 'Dicoding Indonesia',
    };

    // Action and Assert
    expect(() => new AddComment(payload)).toThrowError('ADD_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      thread_id: 'thread-123',
      owner: 'user-123',
      content: true,
    };

    // Action and Assert
    expect(() => new AddComment(payload)).toThrowError('ADD_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create addComment object correctly', () => {
    // Arrange
    const payload = {
      thread_id: 'thread-123',
      owner: 'user-123',
      content: 'Dicoding Indonesia',
    };

    // Action
    const { thread_id, owner, content } = new AddComment(payload);

    // Assert
    expect(thread_id).toEqual(payload.thread_id);
    expect(owner).toEqual(payload.owner);
    expect(content).toEqual(payload.content);
  });
});
