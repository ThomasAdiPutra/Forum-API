const DetailThread = require('../DetailThread');

describe('a DetailThread entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      id: 'thread-123',
      title: 'Dicoding',
      body: 'Dicoding Indonesia',
      created_at: new Date('2023-08-15T12:00:00.000Z'),
    };

    // Action and Assert
    expect(() => new DetailThread(payload)).toThrowError('DETAIL_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 'thread-123',
      title: 'Dicoding',
      body: 'Dicoding Indonesia',
      created_at: new Date('2023-08-15T12:00:00.000Z'),
      username: true,
    };

    // Action and Assert
    expect(() => new DetailThread(payload)).toThrowError('DETAIL_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create detailThread object correctly', () => {
    // Arrange
    const payload = {
      id: 'thread-123',
      title: 'Dicoding',
      body: 'Dicoding Indonesia',
      created_at: new Date('2023-08-15T12:00:00.000Z'),
      username: 'John Doe',
    };

    // Action
    const {
      id, title, body, date, username,
    } = new DetailThread(payload);

    // Assert
    expect(id).toEqual(payload.id);
    expect(title).toEqual(payload.title);
    expect(body).toEqual(payload.body);
    expect(date).toEqual(payload.created_at);
    expect(username).toEqual(payload.username);
  });
});
