const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const cors = require('cors')
const bcrypt = require('bcrypt')

app.use(express.urlencoded({ extended: false }))
app.use(express.json())

app.use(loggin)

const corsOptions = {
    methods: 'GET,PUT,POST,DELETE,PATCH,OPTIONS'
}

app.use(cors())

app.use((req, res, next) => {
    console.log(`Request from IP: ${req.ip} to route: ${req.originalUrl}`);
    next();
  });
  
  app.use((req, res, next) => {
    if (req.method === 'PATCH') {
      return res.status(403).send('PATCH method is not allowed');
    }
    next();
  });
  
 
  app.use(bodyParser.json());
  

  let users = [];
  
  
  app.post('/users', async (req, res) => {
    try {
      const { username, password } = req.body;
      const hashedPassword = await bcrypt.hash(password, 10); 
      users.push({ username, password: hashedPassword });
      res.status(201).send('Usuario creado exitosamente');
    } catch (error) {
      res.status(500).send('Error al crear el usuario');
    }
  });
  
  
  app.get('/users', (req, res) => {
    res.json(users);
  });
  
 
  app.get('/users/:id', (req, res) => {
    const { id } = req.params;
    const user = users[id];
    if (!user) {
      return res.status(404).send('Usuario no encontrado');
    }
    res.json(user);
  });
  
 
  app.delete('/users/:id', (req, res) => {
    const { id } = req.params;
    users = users.filter((user, index) => index !== parseInt(id));
    res.send('Usuario eliminado correctamente');
  });
  
  
  app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const user = users.find(user => user.username === username);
    if (!user) {
      return res.status(401).send('Usuario no encontrado');
    }
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).send('Contraseña incorrecta');
    }
    res.send('Autenticación exitosa');
  });











app.listen(PORT, (e) => {
    e
        ? console.error("🔴 Express no conectado")
        : console.log("🟢 Express conectado y a la escucha en el puerto: " + PORT)
})