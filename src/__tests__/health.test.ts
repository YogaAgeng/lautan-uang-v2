import request from 'supertest';
import app from '../app';

describe('Health Check API', () => {
    it('seharusnya mengembalikan status 200 OK', async () => {
        const response = await request(app).get('/api/health');
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('status', 'success');
    });
});