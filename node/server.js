const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

const { getMinterAddress } = require("./utils");
const { credentials } = require('@grpc/grpc-js');
const { MinterClient } = require('./src/proto/minter_grpc_pb');
const { MintNFTRequest, MintFTRequest } = require('./src/proto/minter_pb');


const app = express();
app.use(express.json());
app.use(cors());

const minterClient = new MinterClient(
    getMinterAddress(),
    credentials.createInsecure()
);

const pool = new Pool({
    user: 'staff_web',
    host: 'pg_main',
    database: 'postgres',
    password: 'CFyaHKhbg96vfLTeWRmXNkYVxt7JPqdU',
    port: 5432,
  });

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

  app.get('/api/get-user-wallet', async (req, res) => {
    const userId = req.query.userId;
    try {
      // Проверка наличия пользователя в таблице users и получение wallet_address
      const userResult = await pool.query('SELECT wallet_address FROM users WHERE id = $1', [userId]);
      if (userResult.rowCount > 0) {
        // Пользователь найден, отправляем wallet_address обратно на клиент
        const wallet = userResult.rows[0].wallet_address;
        return res.json({ wallet });
      } else {
        // Пользователь не найден
        return res.status(404).json({ error: "Пользователь не найден" });
      }
    } catch (error) {
      console.error('Ошибка при запросе к базе данных:', error);
      res.status(500).send('Ошибка сервера');
    }
  });
  
  
  app.post('/api/mint', async (req, res) => {
    try {
      const {username, selectedDishes} = req.body;
      console.log(req.body)
      console.log(username, selectedDishes);
      const userResult = await pool.query('SELECT wallet_address FROM users WHERE id = $1', [username]);
      const wallet = userResult.rows[0].wallet_address;
      const mintNFTRequest = new MintNFTRequest();
      mintNFTRequest.setName('Palette of Indulgence');
      mintNFTRequest.setSymbol('SSH');
      mintNFTRequest.setUri('https://bafkreihf2ql3vxkk45cghjxxuelhrjp3ll4lmkfd4whuugkftuptwnk5fa.ipfs.w3s.link/');
      mintNFTRequest.setRecipient(wallet);

      minterClient.mintNFT(mintNFTRequest, (error, response) => {
        if (error) {
          console.error('Error:', error.message);
        } else {
          console.log('Response:', response.toObject());
          console.log(`NFT: ${response.getPublickey()}`);
          console.log(`NFT: ${response.getSignature()}`);
        }
      });

      const mintFTRequest = new MintFTRequest();
      mintFTRequest.setAmount(10);
      mintFTRequest.setRecipient(wallet);

      minterClient.mintFT(mintFTRequest, (error, response) => {
        if (error) {
          console.error('Error:', error.message);
        } else {
          console.log('Response:', response.toObject());
          console.log(`FT: ${response.getSignature()}`);
        }
      });

      res.status(200).json({ message: 'Данные NFT успешно получены и обработаны', userId: username, selectedDishes_:selectedDishes });
    } catch (error) {
      console.error('Ошибка на сервере', error);
      res.status(500).json({ message: 'Ошибка при обработке данных' });
    }
  });
  

app.listen(3001, () => {
  console.log(`Сервер запущен на порту ${3001}`);
});
