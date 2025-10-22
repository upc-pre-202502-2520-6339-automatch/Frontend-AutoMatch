// =======================================================
// 🌐 Fake API for Car2Go - Compatible with Angular Frontend
// =======================================================
import jsonServer from 'json-server';
import cors from 'cors';
import bodyParser from 'body-parser';

const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();

server.use(cors());
server.use(bodyParser.json());
server.use(middlewares);

console.log('🚀 Fake API running on http://localhost:3000');

// =======================================================
// 🔐 AUTHENTICATION ENDPOINTS
// =======================================================

// Iniciar sesión
server.post('/authentication/sign-in', (req, res) => {
  const { username, email, password } = req.body;
  const db = router.db;

  const user = db
    .get('users')
    .find(
      (u) =>
        (u.username === username || u.email === email) &&
        u.password === password
    )
    .value();

  if (user) {
    res.json({
      id: user.id,
      username: user.username,
      email: user.email,
      token: 'fake-jwt-token',
      accessToken: 'fake-jwt-token',
      roles: [user.role || 'buyer']
    });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
});

// Registrarse
server.post('/authentication/sign-up', (req, res) => {
  const { username, email, password, role } = req.body;
  const db = router.db;

  const existingUser = db.get('users').find({ email }).value();
  if (existingUser) {
    res.status(400).json({ message: 'User already exists' });
  } else {
    const newUser = {
      id: Date.now(),
      username,
      email,
      password,
      role: role || 'buyer',
      isProfileCreated: false
    };
    db.get('users').push(newUser).write();
    res.status(201).json(newUser);
  }
});

// =======================================================
// 👤 USER PROFILE ENDPOINTS
// =======================================================

// Crear o actualizar perfil
server.post('/profiles', (req, res) => {
  const db = router.db;
  const newProfile = req.body;

  // Buscar si el usuario ya tiene perfil
  const existingProfile = db.get('profiles').find({ userId: newProfile.userId }).value();

  if (existingProfile) {
    db.get('profiles')
      .find({ userId: newProfile.userId })
      .assign(newProfile)
      .write();
    return res.status(200).json(newProfile);
  }

  newProfile.id = Date.now();
  db.get('profiles').push(newProfile).write();
  res.status(201).json(newProfile);
});

// Obtener perfil actual del usuario autenticado
server.get('/profiles/me', (req, res) => {
  const db = router.db;
  
  // Simular sesión del usuario 1
  const userId = 1;

  // Buscar usuario
  const user = db.get('users').find({ id: userId }).value();
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  // Buscar perfil asociado al userId
  const profile = db.get('profiles').find({ userId }).value();

  // Si existe, devolver perfil + datos básicos del usuario
  if (profile) {
    return res.status(200).json({
      ...profile,
      username: user.username,
      email: user.email,
      role: user.role
    });
  } else {
    // Si no existe, crear uno vacío para que el front lo reciba
    const newProfile = {
      id: Date.now(),
      userId: user.id,
      first_name: '',
      last_name: '',
      email: user.email,
      dni: '',
      address: '',
      phone_number: ''
    };
    db.get('profiles').push(newProfile).write();
    return res.status(200).json(newProfile);
  }
});

// =======================================================
// 🚗 VEHICLE / CARS ENDPOINTS
// =======================================================

// Obtener todos los autos
server.get('/vehicle/all', (req, res) => {
  const db = router.db;
  const cars = db.get('cars').value();
  res.json(cars);
});

// Obtener autos de un vendedor
server.get('/cars/seller/:sellerId', (req, res) => {
  const db = router.db;
  const sellerId = parseInt(req.params.sellerId, 10);
  const cars = db.get('cars').filter({ sellerId }).value();
  res.json(cars);
});

// =======================================================
// ❤️ FAVORITES
// =======================================================
server.get('/favorites', (req, res) => {
  const db = router.db;
  res.json(db.get('favorites').value());
});

server.post('/favorites', (req, res) => {
  const db = router.db;
  const favorite = req.body;
  db.get('favorites').push(favorite).write();
  res.status(201).json(favorite);
});

server.delete('/favorites/:id', (req, res) => {
  const db = router.db;
  const id = parseInt(req.params.id, 10);
  db.get('favorites').remove({ id }).write();
  res.status(200).json({ message: 'Favorite removed' });
});

// =======================================================
// 💬 CHATS
// =======================================================
server.get('/chats', (req, res) => {
  const db = router.db;
  res.json(db.get('messages').value());
});

server.post('/chats', (req, res) => {
  const db = router.db;
  const message = req.body;
  message.id = Date.now();
  db.get('messages').push(message).write();
  res.status(201).json(message);
});

// =======================================================
// 🔔 NOTIFICATIONS
// =======================================================
server.get('/notifications', (req, res) => {
  res.json([
    { id: 1, message: 'Your car listing was approved', date: '2025-10-21' },
    { id: 2, message: 'New message from buyer Maria', date: '2025-10-20' },
    { id: 3, message: 'Your profile was updated successfully', date: '2025-10-19' }
  ]);
});

// =======================================================
// 💳 MOCK PAYMENT ENDPOINT
// =======================================================
server.put('/profiles/me/payment-methods/add', (req, res) => {
  res.status(200).json({
    message: 'Payment method added (mock)',
    paymentMethod: req.body || {}
  });
});

// =======================================================
// DEFAULT ROUTER
// =======================================================
server.use(router);
server.listen(3000);