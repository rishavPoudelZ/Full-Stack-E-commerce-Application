require('dotenv').config();

const express = require('express');
const app = express();
const cors = require('cors');
const pool = require("./db.js");
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

//middleware
app.use(cors());
app.use(express.json());

//functionn to auntheticate JWT tokens
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]
  if (token == null) return res.sendStatus(401)

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403)
    req.user = user
    next()
  })
}

// Set up multer for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './assets/productImages'); // Destination directory for uploaded files
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname.replace("'", "")}`;
    req.uniqueFilename = uniqueName; // Store the unique filename in the request object
    cb(null, uniqueName); // Unique filename for uploaded file
  }
});
const upload = multer({ storage });


//api to send product details or data
app.get('/products', async (req, res) => {
  try {
    const response = await pool.query('SELECT * from products ORDER BY date_uploaded DESC');
    res.json(response.rows);
  } catch (err) {
    console.error(err.message);
  }
});

//api to filter products based on request query
app.get('/products/filter/query', async (req, res) => {
  const { min, max, orderParameter, orderBy, s } = req.query;
  try {
    const response = await pool.query(`SELECT * FROM products WHERE price BETWEEN ${min} AND ${max} AND (product_name ILIKE '%${s}%' OR description ILIKE '%${s}%') ORDER BY ${orderParameter} ${orderBy}`);
    res.json(response.rows);
  } catch (err) {
    console.error(err);
  }
});


// get user specific products from specific seller
app.get('/products/:user_id', async (req, res) => {
  const  { user_id } = req.params;
  try {
    const response = await pool.query(`SELECT * FROM products WHERE seller_id=${user_id}`);
    res.status(200).json(response.rows);
  } catch (error) {
    console.error(error);
  }
});

//get details of a specific product
app.get('/product/:productId', async (req, res) => {
  const { productId } = req.params;
  try {
    const response = await pool.query(`SELECT username seller_name, user_id seller_id, product_id, product_name, description, price, rating, 
    quantity, date_uploaded, file_name
    FROM 
    users INNER JOIN products 
    ON users.user_id = products.seller_id WHERE product_id = ${productId}`);
    res.json(response.rows);
  } catch (error) {
    console.error(error);
  }
});


// Delete a product
app.delete('/products/:id', authenticateToken, async (req, res) => {
  const user_id = req.user.sub;
  const product_id = req.params.id;
  try {
    const response = await pool.query(`DELETE FROM products WHERE product_id = ${product_id} AND seller_id = ${user_id}`);
    if (response.rowCount === 0) {
      return res.status(404).json({ message: 'Product not found or you do not have permission to delete' });
    }
    res.status(204).end();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

//makes api call to get images of products being shown on the screen for user
// need to chnage this, should add all the product images on a static folder so it doesnt make api call evreytime
app.get('/assets/productImages/:filename', (req, res) => {
  const { filename } = req.params;
  const imagePath = path.join(__dirname, 'assets', 'productImages', filename);
  // Check if the file exists
  if (fs.existsSync(imagePath)) {
    // Send the image file as a response
    res.sendFile(imagePath);
  } else {
    // Image not found, send 404 response
    res.status(404).send('Image not found');
  }
});


//for sending user info mainly usere id and username
app.get('/user', authenticateToken, async (req, res) => {
  const username = req.user.username;
  const user_id = req.user.sub;
  try {
    const response = await pool.query(`SELECT * FROM users WHERE user_id=${user_id} AND username='${username}'`);
    res.json(response.rows);
  } catch (error) {
    console.error(error);
  }


});


//updating user details such as full name address etc
app.put('/user/details', authenticateToken, async (req, res) => {
  const user_id = req.user.sub;
  const { username, full_name, email, phone, address, city, zip } = req.body;
  try {
    await pool.query(`UPDATE users SET full_name='${full_name}', email='${email}', phone='${phone}', address='${address}', city='${city}', zip='${zip}' WHERE user_id=${user_id}`);
    res.json({ message: 'User details updated successfully' });
  } catch (error) {
    console.error(error);
  }
});

//updating the user form buyer to seller
app.put('/user/user_type', authenticateToken, async (req, res) => {
  const user_id = req.user.sub;
  try {
    await pool.query(`UPDATE users SET user_type = 'seller' WHERE user_id = ${user_id}`);
    res.status(204).end();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

//for register a new user
app.post('/register/user', async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const response = await pool.query(`SELECT * from users where username='${username}'`);
    if (response.rowCount == 0) {
      try {
        const passwordHash = await bcrypt.hash(password, 10);
        await pool.query(`INSERT INTO users (username, email, password, user_type) VALUES ('${username}', '${email}', '${passwordHash}', 'buyer')`);
        res.status(201).json({ message: 'User registered successfully' });
      } catch (error) {
        console.error(error);
      }
    }
    else {
      return res.status(409).json({ message: 'Username already exists' });
    }
  } catch (error) {
    console.error(error);
  }
});


//used to login user
app.post('/login/user', async (req, res) => {
  const { username, password } = req.body;
  const response = await pool.query(`SELECT * from users where username='${username}'`);

  if (response.rowCount != 0) {
    const id = response.rows[0].user_id;
    const username = response.rows[0].username;
    const decryptPassword = response.rows[0].password;

    try {
      const authenticate = await bcrypt.compare(password, decryptPassword);

      if (authenticate) {
        const user = { sub: id, username: username }
        const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);
        res.json({ message: "Login Sucessfull", token: accessToken });
      } else {
        res.status(401).json({ message: 'Invalid username or password' })
      }

    } catch (error) {
      res.status(500).json({ message: 'An unexpected error occured on the server' })
      console.error(error);
    }

  } else {
    res.status(401).json({ message: 'Invalid username or password' })
  }
})

// Define upload route
app.post('/upload/product', authenticateToken, upload.single('image'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const user_id = req.user.sub;
  const { productName, price, description, quantity } = req.body;
  const currentDate = new Date().toISOString();
  const file_name = req.uniqueFilename; // Filename of the uploaded file
  console.log(quantity, price, productName, description, file_name, currentDate, user_id)
  try {
    await pool.query(`INSERT INTO products (seller_id, product_name, description, price, quantity, date_uploaded, file_name) VALUES (${user_id}, '${productName}', '${description}', ${price}, ${quantity}, '${currentDate}', '${file_name}')`);
    res.status(201).json({ message: 'Product added successfully' });
  } catch (error) {
    console.error(error);
  }
  res.status(201).end();
});

// get seller details 
app.get('/seller/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const response = await pool.query(`SELECT username FROM users WHERE user_id=${id}`);
    res.json(response.rows);
  } catch (error) {
    console.error(error);
  }
});


app.post('/cart', authenticateToken, async (req, res) => {
  const user_id = req.user.sub;
  const { product_id, quantity } = req.body;
  let total_price = 0;
  try {
    const response = await pool.query('select price from products where product_id = $1', [product_id]);
    for (let row of response.rows) {
      total_price = row.price * quantity;
    }
  } catch (error) {
    console.error(error);
  }
  try {
    await pool.query(`INSERT INTO carts (user_id, product_id, quantity, total_price) VALUES (${user_id}, ${product_id}, ${quantity}, ${total_price})`);
    res.status(201).json({ message: 'Product added to cart successfully' });
  } catch (error) {
    console.error(error);
  }
});


//get all the products in the cart
app.get('/cart', authenticateToken, async (req, res) => {
  const user_id = req.user.sub;
  try {
    const response = await pool.query(`SELECT carts.product_id, products.product_name, carts.user_id, products.price, 
    carts.quantity, products.file_name
    FROM products join carts on 
    products.product_id = carts.product_id WHERE user_id = ${user_id}`);
    res.json(response.rows);
  } catch (error) {
    console.error(error);
  }
});

app.delete('/cart/:product_id', authenticateToken, async (req, res) => {
  const user_id = req.user.sub;
  const { product_id } = req.params;
  try {
    await pool.query(`DELETE FROM carts WHERE user_id=${user_id} AND product_id=${product_id}`);
    res.status(204).json({message: 'Item deleted successfully'}).end();
  } catch (error) {
    console.error(error);
  }
});

app.post('/checkout', authenticateToken, async (req, res) => {
  const user_id = req.user.sub;
  const currentDate = new Date().toISOString();
  let total_price = 0;
  try {
    const items = await pool.query(`SELECT * FROM carts WHERE user_id=${user_id}`);
    for (let row of items.rows) {
      total_price = row.total_price + total_price;
    }
    await pool.query(`INSERT into orders (user_id, total_price, order_status, transaction_date) VALUES (${user_id}, ${total_price}, 'Completed', '${currentDate}')`)
    const order_id = await pool.query(`SELECT order_id FROM orders WHERE user_id=${user_id} AND transaction_date='${currentDate}'`);
    for (let row of items.rows) {
      await pool.query(`INSERT INTO transactions (order_id, product_id, price, quantity) VALUES (${order_id.rows[0].order_id}, ${row.product_id}, ${row.total_price}, ${row.quantity})`);
    }
    await pool.query(`DELETE FROM carts WHERE user_id=${user_id}`);
    res.status(204).json({message: 'Checkout successful'}).end();
  } catch (error) {
    console.error(error);
  }
});

//for getting all the orders of a user

app.get('/orders', authenticateToken, async (req, res) => {
  const user_id = req.user.sub;
  try {
    const response = await pool.query(`SELECT * FROM orders WHERE user_id=${user_id}`);
    res.json(response.rows);
  } catch (error) {
    console.error(error);
  }
});

//for getting all the transactions of a user
app.get('/transactions/:order_id', authenticateToken, async (req, res) => {
  const user_id = req.user.sub;
  const { order_id } = req.params;
  try {
    const response = await pool.query(`SELECT products.product_id, products.product_name, products.price, products.file_name,
    transactions.quantity, transactions.price as total_price, transactions.order_id 
        FROM products join transactions on 
        products.product_id = transactions.product_id 
      join orders on transactions.order_id = orders.order_id WHERE user_id = ${user_id}
      AND transactions.order_id = ${order_id}`);
    res.json(response.rows);
  } catch (error) {
    console.error(error);
  }
});





app.listen(5000, () => {
  console.log('server has started listening on port 5000');
})
