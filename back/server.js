const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();
const port = 3001;

// Настройка подключения к базе данных PostgreSQL
const pool = new Pool({
    user: 'admin_web', // Имя пользователя
    host: 'pg_main', // Адрес сервера базы данных
    database: 'postgres', // Имя базы данных
    password: 'zV8YbrJHjqkP5NRctnQGT2whuK7FMUD9', // Пароль
    port: 5432, // Порт
  });

app.use(express.json());
app.use(cors());

// Маршрут для получения событий
app.get('/api/events', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM events');
    res.status(200).json(rows);
  } catch (error) {
    res.status(500).send('Ошибка на сервере');
  }
});

app.post('/api/check-user', async (req, res) => {
    const { userId } = req.body; // ID пользователя, полученный от клиента
    try {
      // Проверка наличия пользователя в таблице admins
  
      // Проверка наличия пользователя в таблице institution_staff
      const staffResult = await pool.query('SELECT * FROM institution_staff WHERE user_id = $1', [userId]);
      if (staffResult.rowCount > 0) {
        return res.json({ role: 'staff' });
      }
  
      // Пользователь не найден в обеих таблицах
      res.json({ role: 'guest' });
    } catch (error) {
      console.error('Ошибка при проверке пользователя:', error);
      res.status(500).send('Ошибка сервера');
    }
  });
  

// Маршрут для добавления события
app.post('/api/events', async (req, res) => {
  try {
    const { title, label, upcoming } = req.body;
    const { rows } = await pool.query('INSERT INTO events (title, label, upcoming) VALUES ($1, $2, $3) RETURNING *', [title, label, upcoming]);
    res.status(201).json(rows[0]);
  } catch (error) {
    res.status(500).send('Ошибка на сервере');
  }
});

app.listen(port, () => {
  console.log(`Сервер запущен на порту ${port}`);
});
