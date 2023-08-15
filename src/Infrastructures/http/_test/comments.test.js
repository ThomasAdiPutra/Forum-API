const pool = require('../../database/postgres/pool');
const AuthenticationsTableTestHelper = require('../../../../tests/AuthenticationsTableTestHelper');
const UserTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const container = require('../../container');
const createServer = require('../createServer');
const AuthenticationTokenManager = require('../../../Applications/security/AuthenticationTokenManager');
const LoginUserUseCase = require('../../../Applications/use_case/LoginUserUseCase');

describe('/threads endpoint', () => {
	var accessToken;

	beforeAll(async () => {
		await UserTableTestHelper.addUser({});
		const user = await UserTableTestHelper.findUsersById('user-123');
		accessToken = await container.getInstance(AuthenticationTokenManager.name).createAccessToken(user[0]);
		await AuthenticationsTableTestHelper.addToken(accessToken);
		await ThreadsTableTestHelper.addThread({});
	});

	beforeEach(async () => {

	});

	afterAll(async () => {
		await UserTableTestHelper.cleanTable({});
		await ThreadsTableTestHelper.cleanTable();
		await pool.end();
	});

	afterEach(async () => {
		await CommentsTableTestHelper.cleanTable();
	});

	describe('when POST threads/{threadId}/comments', () => {
		it('should response 201 and persisted comment', async () => {
			// Arrange
			const requestPayload = {
				content: 'Dicoding',
			};

			// eslint-disable-next-line no-undef
			const server = await createServer(container);

			// Action
			const response = await server.inject({
				method: 'POST',
				url: '/threads/thread-123/comments',
				payload: requestPayload,
				headers: {
					Authorization: `Bearer ${accessToken}`,
				},
			});

			// Assert
			const responseJson = JSON.parse(response.payload);
			expect(response.statusCode).toEqual(201);
			expect(responseJson.status).toEqual('success');
			expect(responseJson.data.addedComment).toBeDefined();
		});

		it('should response 401 when access token not provided', async () => {
			// Arrange
			const requestPayload = {
				content: 'dicoding',
			};
			const server = await createServer(container);

			// Action
			const response = await server.inject({
				method: 'POST',
				url: '/threads/thread-123/comments',
				payload: requestPayload,
			});

			// Assert
			const responseJson = JSON.parse(response.payload);
			expect(response.statusCode).toEqual(401);
			expect(responseJson.error).toEqual('Unauthorized');
			expect(responseJson.message).toEqual('Missing authentication');
		});

		it('should response 400 when request payload not contain needed property', async () => {
			// Arrange
			const requestPayload = {

			};
			const server = await createServer(container);

			// Action
			const response = await server.inject({
				method: 'POST',
				url: '/threads/thread-123/comments',
				payload: requestPayload,
				headers: {
					Authorization: `Bearer ${accessToken}`,
				},
			});

			// Assert
			const responseJson = JSON.parse(response.payload);
			expect(response.statusCode).toEqual(400);
			expect(responseJson.status).toEqual('fail');
			expect(responseJson.message).toEqual('tidak dapat membuat komentar baru karena properti yang dibutuhkan tidak ada');
		});

		it('should response 400 when request payload not meet data type specification', async () => {
			// Arrange
			const requestPayload = {
				content: 123
			};
			const server = await createServer(container);

			// Action
			const response = await server.inject({
				method: 'POST',
				url: '/threads/thread-123/comments',
				payload: requestPayload,
				headers: {
					Authorization: `Bearer ${accessToken}`,
				},
			});

			// Assert
			const responseJson = JSON.parse(response.payload);
			expect(response.statusCode).toEqual(400);
			expect(responseJson.status).toEqual('fail');
			expect(responseJson.message).toEqual('tidak dapat membuat komentar baru karena tipe data tidak sesuai');
		});

		it('should response 404 when thread not found', async () => {
			// Arrange
			const requestPayload = {
				content: 'Dicoding'
			};
			const server = await createServer(container);

			// Action
			const response = await server.inject({
				method: 'POST',
				url: '/threads/thread-321/comments',
				payload: requestPayload,
				headers: {
					Authorization: `Bearer ${accessToken}`,
				},
			});

			// Assert
			const responseJson = JSON.parse(response.payload);
			expect(response.statusCode).toEqual(404);
			expect(responseJson.status).toEqual('fail');
			expect(responseJson.message).toEqual('Thread tidak ditemukan');
		});
	});

	describe('when DELETE threads/{threadId}/comments/{id}', () => {
		it('should response 200 and deleted comment', async () => {
			// Arrange
			await CommentsTableTestHelper.addComment({});
			const id = 'comment-123';

			// eslint-disable-next-line no-undef
			const server = await createServer(container);

			// Action
			const response = await server.inject({
				method: 'DELETE',
				url: `/threads/thread-123/comments/${id}`,
				headers: {
					Authorization: `Bearer ${accessToken}`,
				},
			});

			// Assert
			const responseJson = JSON.parse(response.payload);
			expect(response.statusCode).toEqual(200);
			expect(responseJson.status).toEqual('success');
		});

		it('should response 401 when access token not provided', async () => {
			// Arrange
			await CommentsTableTestHelper.addComment({});
			const id = 'comment-123';

			// eslint-disable-next-line no-undef
			const server = await createServer(container);

			// Action
			const response = await server.inject({
				method: 'DELETE',
				url: `/threads/thread-123/comments/${id}`,
			});

			// Assert
			const responseJson = JSON.parse(response.payload);
			expect(response.statusCode).toEqual(401);
			expect(responseJson.error).toEqual('Unauthorized');
			expect(responseJson.message).toEqual('Missing authentication');
		});

		it('should response 403 when owner is not active user', async () => {
			// Arrange
			const id = 'comment-123';
			await CommentsTableTestHelper.addComment({});
			await UserTableTestHelper.addUser({ id: 'user-1', username: 'user-1' });
			const user = await UserTableTestHelper.findUsersById('user-1');
			accessToken = await container.getInstance(AuthenticationTokenManager.name).createAccessToken(user[0]);

			await AuthenticationsTableTestHelper.addToken(accessToken);
			// eslint-disable-next-line no-undef
			const server = await createServer(container);

			// Action
			const response = await server.inject({
				method: 'DELETE',
				url: `/threads/thread-123/comments/${id}`,
				headers: {
					Authorization: `Bearer ${accessToken}`,
				},
			});

			// Assert
			const responseJson = JSON.parse(response.payload);
			expect(response.statusCode).toEqual(403);
			expect(responseJson.status).toEqual('fail');
			expect(responseJson.message).toEqual('Authorization error!');
		});

		it('should response 404 when comment not in thread', async () => {
			// Arrange
			await CommentsTableTestHelper.addComment({});
			const id = 'comment-321';

			// eslint-disable-next-line no-undef
			const server = await createServer(container);

			// Action
			const response = await server.inject({
				method: 'DELETE',
				url: `/threads/thread-123/comments/${id}`,
				headers: {
					Authorization: `Bearer ${accessToken}`,
				},
			});

			// Assert
			const responseJson = JSON.parse(response.payload);
			expect(response.statusCode).toEqual(404);
			expect(responseJson.status).toEqual('fail');
			expect(responseJson.message).toEqual('Komentar tidak ditemukan!');
		});
	});
});
