const request = require('supertest');
const app = require('../app'); 
const Photos = require('../models/photos');
const mongoose = require('mongoose');

jest.mock('../models/photos'); 

describe('DELETE /photos/:photoId', () => {
  it('renvoie 200 si la photo est supprimée', async () => {
    const mockPhoto = { _id: '123', imageUrl: 'fake.jpg' };
    Photos.findByIdAndDelete.mockResolvedValue(mockPhoto);

    const res = await request(app).delete('/photos/123');

    expect(res.statusCode).toBe(200);
    expect(res.body.result).toBe(true);
    expect(res.body.message).toBe('Photo supprimée avec succès'); 
  });

  it('renvoie 404 si la photo est introuvable', async () => {
    Photos.findByIdAndDelete.mockResolvedValue(null);

    const res = await request(app).delete('/photos/invalide');

    expect(res.statusCode).toBe(404);
    expect(res.body.message).toBe('Photo inexistante');
  });

  afterAll(async () => {
    await mongoose.connection.close(); 
  });
});
