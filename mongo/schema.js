db = db.getSiblingDB('acqua_estetica');

db.createCollection('services', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['code', 'name', 'description', 'category', 'price', 'durationMinutes'],
      properties: {
        code: { bsonType: 'string' },
        name: { bsonType: 'string' },
        description: { bsonType: 'string' },
        category: { enum: ['facial', 'corporal', 'inyectables', 'bienestar', 'unas', 'depilacion'] },
        price: { bsonType: ['int', 'long', 'double', 'decimal'] },
        durationMinutes: { bsonType: ['int', 'long'] },
        active: { bsonType: 'bool' }
      }
    }
  }
});

db.createCollection('products', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['code', 'name', 'description', 'category', 'price', 'stock'],
      properties: {
        code: { bsonType: 'string' },
        name: { bsonType: 'string' },
        description: { bsonType: 'string' },
        category: { enum: ['cremas', 'suplementos', 'skincare'] },
        price: { bsonType: ['int', 'long', 'double', 'decimal'] },
        stock: { bsonType: ['int', 'long'] },
        active: { bsonType: 'bool' }
      }
    }
  }
});

db.createCollection('clients');
db.createCollection('appointments');
db.createCollection('orders');

db.services.createIndex({ code: 1 }, { unique: true });
db.services.createIndex({ category: 1, active: 1 });
db.products.createIndex({ code: 1 }, { unique: true });
db.products.createIndex({ category: 1, active: 1 });
db.appointments.createIndex({ date: 1, time: 1, 'service.serviceId': 1 }, { unique: true });
db.orders.createIndex({ createdAt: 1 });
