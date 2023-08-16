const AddReply = require('../AddReply');

describe('a AddReply entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      content: 'Dicoding Indonesia',
    };

    // Action and Assert
    expect(() => new AddReply(payload)).toThrowError('ADD_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      comment_id: 'comment-123',
      owner: 'user-123',
      content: true,
    };

    // Action and Assert
    expect(() => new AddReply(payload)).toThrowError('ADD_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create addComment object correctly', () => {
    // Arrange
    const payload = {
      comment_id: 'comment-123',
      owner: 'user-123',
      content: 'Dicoding Indonesia',
    };

    // Action
    const { comment_id, owner, content } = new AddReply(payload);

    // Assert
    expect(comment_id).toEqual(payload.comment_id);
    expect(owner).toEqual(payload.owner);
    expect(content).toEqual(payload.content);
  });
});
