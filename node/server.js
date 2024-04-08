const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
// const grpc = require('@grpc/grpc-js');
// const credentials = require('@grpc/grpc-js');
// const proto = require('./src/proto/minter_grpc_pb');
// const MinterClient = require('./src/proto/minter_grpc_pb');

// const messages = require('./src/proto/minter_pb');
// const MintNFTRequest = require('./src/proto/minter_pb');
// const MintNFTResponse = require('./src/proto/minter_pb');


const app = express();
app.use(express.json());
app.use(cors());

const pool = new Pool({
    user: 'admin_web', // Имя пользователя
    host: 'pg_main', // Адрес сервера базы данных
    database: 'postgres', // Имя базы данных
    password: 'zV8YbrJHjqkP5NRctnQGT2whuK7FMUD9', // Пароль
    port: 5432, // Порт
  });


const port = 5000;
const host = "minter";
const serverAddress = `${host}:${port}`;

// const client = new MinterClient(serverAddress, credentials.createInsecure());
// const mintNFTRequest = new MintNFTRequest();
// mintNFTRequest.setName('Palette of Indulgence');
// mintNFTRequest.setSymbol('SSH');
// mintNFTRequest.setUri('https://izzynfts.com/foodpics/grilleblack.json');
// mintNFTRequest.setRecipient('F1psEzh4pggrDVuq2nLHNgyJT78nFEyof8kCkhkZmrQf');
// // Настройка подключения к базе данных PostgreSQL

// // Mint an existing FT to a recipient
// mintFTRequest.setAmount(10);
// mintFTRequest.setRecipient('F1psEzh4pggrDVuq2nLHNgyJT78nFEyof8kCkhkZmrQf');

// client.mintFT(mintFTRequest, (error, response) => {
//   if (error) {
//     console.error('Error:', error.message);
//   } else {
//     console.log('Response:', response.toObject());
//   }
// });

app.get('/api/check-user', async (req, res) => {
  const userId = req.query.userId;
    try {
      // Проверка наличия пользователя в таблице admins
  
      // Проверка наличия пользователя в таблице institution_staff
      const staffResult = await pool.query('SELECT * FROM institution_staff WHERE user_id = $1', [userId]);
      if (staffResult.rowCount > 0) {
        return res.json({ role: 'staff' });
      }
  
      // Пользователь не найден в обеих таблицах
      return res.json({ role: 'guest' });
    } catch (error) {
      console.error('Ошибка при проверке пользователя:', error);
      res.status(500).send('Ошибка сервера');
    }
  });
  
  app.post('/api/mint', (req, res) => {
    try {
      const {userID, dishes} = req.body;
      console.log(req.body)
      console.log(userID, dishes);

      res.status(200).json({ message: 'Данные NFT успешно получены и обработаны', userId: userID, dishes_:dishes });
    } catch (error) {
      console.error('Ошибка на сервере', error);
      res.status(500).json({ message: 'Ошибка при обработке данных' });
    }
  });
  

app.listen(3001, () => {
  console.log(`Сервер запущен на порту ${3001}`);
});
