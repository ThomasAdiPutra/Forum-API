const DetailReply = require('../DetailReply');

describe('a DetailReply entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      username: 'John Doe',
      created_at: new Date('2023-08-15T12:00:00.000Z'),
    };

    // Action and Assert
    expect(() => new DetailReply(payload)).toThrowError('DETAIL_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      username: 'John Doe',
      created_at: new Date('2023-08-15T12:00:00.000Z'),
      content: true,
    };

    // Action and Assert
    expect(() => new DetailReply(payload)).toThrowError('DETAIL_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create detailComment object correctly', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      username: 'John Doe',
      created_at: new Date('2023-08-15T12:00:00.000Z'),
      content: 'Dicoding',
    };

    // Action
    const {
      id, username, date, content,
    } = new DetailReply(payload);

    // Assert
    expect(id).toEqual(payload.id);
    expect(username).toEqual(payload.username);
    expect(date).toEqual(payload.created_at);
    expect(content).toEqual(payload.content);
  });
});
