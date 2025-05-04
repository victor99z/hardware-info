import request from 'supertest';
import express from 'express';
import productRoutes from '../routes/productRoutes';

const app = express();
app.use(express.json());
app.use('/api', productRoutes);

describe('Product API', () => {
    it('should fetch all products', async () => {
        const response = await request(app).get('/api/products');
        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
    });

    it('should fetch a product by ID', async () => {
        const productId = '1'; // Replace with a valid ID from your database
        const response = await request(app).get(`/api/products/${productId}`);
        if (response.status === 404) {
            expect(response.body.error).toBe('Product not found');
        } else {
            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('id', productId);
        }
    });

    it('should create a new product', async () => {
        const newProduct = {
            url: 'http://example.com',
            store: 'Example Store',
            tags: ['tag1', 'tag2'],
            title: 'Example Product',
            product_info: 'Some product info',
        };
        const response = await request(app).post('/api/products').send(newProduct);
        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('id');
    });

    it('should update a product', async () => {
        const productId = '1'; // Replace with a valid ID from your database
        const updatedData = {
            title: 'Updated Product Title',
        };
        const response = await request(app).put(`/api/products/${productId}`).send(updatedData);
        if (response.status === 404) {
            expect(response.body.error).toBe('Product not found');
        } else {
            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('title', updatedData.title);
        }
    });

    it('should delete a product', async () => {
        const productId = '1'; // Replace with a valid ID from your database
        const response = await request(app).delete(`/api/products/${productId}`);
        if (response.status === 404) {
            expect(response.body.error).toBe('Product not found');
        } else {
            expect(response.status).toBe(204);
        }
    });
});