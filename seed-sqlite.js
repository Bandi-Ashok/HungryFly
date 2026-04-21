const db = require('./db-sqlite').getConnection();
const bcrypt = require('bcrypt');

const categoryConfig = [
  { name:'Fresh', icon:'??', subcats:['Vegetables','Fruits','Herbs'], priceRange:[20,200], rating:4.2, image:'https://picsum.photos/id/130/400/400' },
  { name:'Summer', icon:'??', subcats:['Coolers','Sunscreen','Summer Wear'], priceRange:[100,800], rating:4.3, image:'https://picsum.photos/id/20/400/400' },
  { name:'Electronics', icon:'??', subcats:['Mobiles','Laptops','Audio','Accessories'], priceRange:[500,150000], rating:4.4, image:'https://picsum.photos/id/0/400/400' },
  { name:'50% Discount', icon:'???', subcats:['All Items'], priceRange:[50,2000], discount:50, image:'https://picsum.photos/id/26/400/400' },
  { name:'Wedding', icon:'??', subcats:['Jewelry','Clothing','Gifts'], priceRange:[500,50000], rating:4.5, image:'https://picsum.photos/id/30/400/400' },
  { name:'Home', icon:'??', subcats:['Furniture','Decor','Kitchen'], priceRange:[300,20000], rating:4.2, image:'https://picsum.photos/id/106/400/400' },
  { name:'Fashion', icon:'??', subcats:['Men','Women','Kids','Accessories'], priceRange:[400,5000], rating:4.3, image:'https://picsum.photos/id/96/400/400' },
  { name:'Beauty', icon:'??', subcats:['Skincare','Makeup','Haircare'], priceRange:[150,3000], rating:4.4, image:'https://picsum.photos/id/13/400/400' },
  { name:'Kids', icon:'??', subcats:['Toys','Clothing','School'], priceRange:[200,2000], rating:4.5, image:'https://picsum.photos/id/169/400/400' },
  { name:'Grocery', icon:'??', subcats:['Staples','Snacks','Beverages'], priceRange:[30,500], rating:4.3, image:'https://picsum.photos/id/102/400/400' },
  { name:'Pharmacy', icon:'??', subcats:['Medicines','Wellness','Personal Care'], priceRange:[50,1000], rating:4.6, image:'https://picsum.photos/id/33/400/400' },
  { name:'Food', icon:'??', subcats:['Pizza','Burger','Biryani','Chinese'], priceRange:[150,600], rating:4.3, image:'https://picsum.photos/id/108/400/400' },
  { name:'Instamart', icon:'?', subcats:['Groceries','Essentials','Snacks'], priceRange:[40,800], rating:4.4, image:'https://picsum.photos/id/91/400/400' },
  { name:'Dineout', icon:'???', subcats:['Restaurants','Cafes','Bars'], priceRange:[500,3000], rating:4.2, image:'https://picsum.photos/id/62/400/400' },
  { name:'Gifts', icon:'??', subcats:['Personalized','Flowers','Cakes'], priceRange:[300,2000], rating:4.5, image:'https://picsum.photos/id/129/400/400' },
  { name:'Scents', icon:'??', subcats:['Perfumes','Deodorants','Candles'], priceRange:[200,3000], rating:4.3, image:'https://picsum.photos/id/34/400/400' },
  { name:'Vegetables', icon:'??', subcats:['Fresh','Organic','Exotic'], priceRange:[20,150], rating:4.5, image:'https://picsum.photos/id/127/400/400' },
  { name:'Fresh Fruits', icon:'??', subcats:['Apples','Bananas','Berries'], priceRange:[30,300], rating:4.6, image:'https://picsum.photos/id/128/400/400' },
  { name:'Dairy Bread & Eggs', icon:'??', subcats:['Milk','Bread','Eggs','Cheese'], priceRange:[20,200], rating:4.4, image:'https://picsum.photos/id/121/400/400' },
  { name:'Meat & Seafood', icon:'??', subcats:['Chicken','Mutton','Fish','Prawns'], priceRange:[200,800], rating:4.3, image:'https://picsum.photos/id/139/400/400' },
  { name:'Grocery Kitchen', icon:'??', subcats:['Utensils','Appliances','Storage'], priceRange:[100,3000], rating:4.2, image:'https://picsum.photos/id/20/400/400' },
  { name:'Snacks & Drinks', icon:'??', subcats:['Chips','Biscuits','Soft Drinks'], priceRange:[20,150], rating:4.3, image:'https://picsum.photos/id/145/400/400' },
  { name:'Beauty & Wellness', icon:'??', subcats:['Skincare','Supplements'], priceRange:[200,2000], rating:4.5, image:'https://picsum.photos/id/13/400/400' },
  { name:'Household Lifestyle', icon:'??', subcats:['Cleaning','Laundry','Tools'], priceRange:[100,1500], rating:4.1, image:'https://picsum.photos/id/46/400/400' },
  { name:'Shop by Store', icon:'??', subcats:['Brands','Local Stores'], priceRange:[100,5000], rating:4.0, image:'https://picsum.photos/id/96/400/400' },
  { name:'Babycare Essentials', icon:'??', subcats:['Diapers','Feeding','Bath'], priceRange:[200,1500], rating:4.7, image:'https://picsum.photos/id/169/400/400' },
  { name:'Summer Glow Essentials', icon:'?', subcats:['Sunscreen','Moisturizer','Serum'], priceRange:[300,1200], rating:4.5, image:'https://picsum.photos/id/20/400/400' },
  { name:'Get Best Hair Day', icon:'??', subcats:['Shampoo','Conditioner','Oil'], priceRange:[150,800], rating:4.4, image:'https://picsum.photos/id/5/400/400' },
  { name:'All in One Series', icon:'??', subcats:['Combos','Kits'], priceRange:[500,2500], rating:4.3, image:'https://picsum.photos/id/0/400/400' },
  { name:'Breakfast Cereals', icon:'??', subcats:['Oats','Muesli','Cornflakes'], priceRange:[100,400], rating:4.4, image:'https://picsum.photos/id/32/400/400' },
  { name:'Regional Pantry Picks', icon:'???', subcats:['South Indian','North Indian','Snacks'], priceRange:[50,300], rating:4.5, image:'https://picsum.photos/id/145/400/400' },
  { name:'Best Skincare', icon:'??', subcats:['Cleanser','Moisturizer','Serum'], priceRange:[300,2000], rating:4.6, image:'https://picsum.photos/id/13/400/400' },
  { name:'Refreshing Cold Sips', icon:'??', subcats:['Juices','Mocktails','Iced Tea'], priceRange:[40,200], rating:4.3, image:'https://picsum.photos/id/97/400/400' },
  { name:'Snacks Munchies', icon:'??', subcats:['Chips','Nachos','Popcorn'], priceRange:[20,100], rating:4.2, image:'https://picsum.photos/id/108/400/400' },
  { name:'Best Deals Cooking Essentials', icon:'??', subcats:['Oil','Spices','Grains'], priceRange:[50,500], discount:30, image:'https://picsum.photos/id/102/400/400' },
  { name:'Pet Supplies', icon:'??', subcats:['Dog Food','Cat Food','Accessories'], priceRange:[150,2000], rating:4.5, image:'https://picsum.photos/id/141/400/400' }
];

async function seed() {
  db.serialize(() => {
    // Drop tables
    db.run('DROP TABLE IF EXISTS OrderItems');
    db.run('DROP TABLE IF EXISTS Orders');
    db.run('DROP TABLE IF EXISTS CartItems');
    db.run('DROP TABLE IF EXISTS Products');
    db.run('DROP TABLE IF EXISTS Subcategories');
    db.run('DROP TABLE IF EXISTS Categories');
    db.run('DROP TABLE IF EXISTS Users');
    db.run('DROP TABLE IF EXISTS Coupons');
    db.run('DROP TABLE IF EXISTS Offers');

    // Create tables
    db.run('CREATE TABLE Users (userId INTEGER PRIMARY KEY AUTOINCREMENT, mobile TEXT UNIQUE, passwordHash TEXT, name TEXT, address TEXT, createdAt DATETIME DEFAULT CURRENT_TIMESTAMP)');
    db.run('CREATE TABLE Categories (categoryId INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT UNIQUE, icon TEXT)');
    db.run('CREATE TABLE Subcategories (subcategoryId INTEGER PRIMARY KEY AUTOINCREMENT, categoryId INTEGER, name TEXT, FOREIGN KEY(categoryId) REFERENCES Categories(categoryId))');
    db.run('CREATE TABLE Products (productId INTEGER PRIMARY KEY AUTOINCREMENT, categoryId INTEGER, subcategoryId INTEGER, name TEXT, price REAL, rating REAL, imageEmoji TEXT, discountPercent INTEGER, isPopular INTEGER, createdAt DATETIME DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY(categoryId) REFERENCES Categories(categoryId), FOREIGN KEY(subcategoryId) REFERENCES Subcategories(subcategoryId))');
    db.run('CREATE TABLE CartItems (cartItemId INTEGER PRIMARY KEY AUTOINCREMENT, userId INTEGER, productId INTEGER, quantity INTEGER, addedAt DATETIME DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY(userId) REFERENCES Users(userId), FOREIGN KEY(productId) REFERENCES Products(productId))');
    db.run('CREATE TABLE Orders (orderId INTEGER PRIMARY KEY AUTOINCREMENT, userId INTEGER, orderNumber TEXT UNIQUE, totalAmount REAL, discountAmount REAL, finalAmount REAL, status TEXT, placedAt DATETIME DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY(userId) REFERENCES Users(userId))');
    db.run('CREATE TABLE OrderItems (orderItemId INTEGER PRIMARY KEY AUTOINCREMENT, orderId INTEGER, productId INTEGER, productName TEXT, price REAL, quantity INTEGER, FOREIGN KEY(orderId) REFERENCES Orders(orderId), FOREIGN KEY(productId) REFERENCES Products(productId))');
    db.run('CREATE TABLE Coupons (couponId INTEGER PRIMARY KEY AUTOINCREMENT, code TEXT UNIQUE, description TEXT, discountPercent INTEGER, maxDiscountAmount REAL, validUntil DATE)');
    db.run('CREATE TABLE Offers (offerId INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, description TEXT, couponCode TEXT, validUntil DATE)');

    // Insert categories & subcategories
    for (let cat of categoryConfig) {
      db.run('INSERT INTO Categories (name, icon) VALUES (?, ?)', [cat.name, cat.icon], function(err) {
        if (err) console.error(err);
        const catId = this.lastID;
        for (let sub of cat.subcats) {
          db.run('INSERT INTO Subcategories (categoryId, name) VALUES (?, ?)', [catId, sub]);
        }
      });
    }

    // Insert products after a short delay to ensure categories are in
    setTimeout(() => {
      for (let cat of categoryConfig) {
        db.get('SELECT categoryId FROM Categories WHERE name = ?', [cat.name], (err, row) => {
          if (row) {
            const catId = row.categoryId;
            db.all('SELECT subcategoryId, name FROM Subcategories WHERE categoryId = ?', [catId], (err, subs) => {
              const subMap = {};
              subs.forEach(s => subMap[s.name] = s.subcategoryId);
              const productsCount = cat.subcats.length * 30 + 40;
              for (let i = 0; i < productsCount; i++) {
                const subName = cat.subcats[i % cat.subcats.length];
                const subId = subMap[subName];
                const price = Math.floor(Math.random() * (cat.priceRange[1] - cat.priceRange[0]) + cat.priceRange[0]);
                const discount = cat.discount || (Math.random() > 0.7 ? Math.floor(Math.random() * 30) + 10 : 0);
                const rating = (cat.rating + (Math.random() * 0.6 - 0.3)).toFixed(1);
                const isPopular = i < 15 ? 1 : 0;
                const productName = `${subName} ${['Premium','Classic','Organic','Fresh','Deluxe'][i%5]} ${i+1}`;
                const imageUrl = cat.image; // Use category image for all its products
                db.run('INSERT INTO Products (categoryId, subcategoryId, name, price, rating, imageEmoji, discountPercent, isPopular) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
                  [catId, subId, productName, price, rating, imageUrl, discount, isPopular]);
              }
            });
          }
        });
      }
    }, 1000);

    // Insert user and coupons after delay
    setTimeout(async () => {
      const hashed = await bcrypt.hash('123456', 10);
      db.run('INSERT INTO Users (mobile, passwordHash, name, address) VALUES (?, ?, ?, ?)', ['9876543210', hashed, 'Rahul Kumar', 'MG Road, Bangalore']);
      db.run('INSERT INTO Coupons (code, description, discountPercent, maxDiscountAmount) VALUES (?, ?, ?, ?)', ['HUNGRY50', '50% off up to ?100', 50, 100]);
      db.run('INSERT INTO Coupons (code, description, discountPercent, maxDiscountAmount) VALUES (?, ?, ?, ?)', ['SAVE20', '20% off on total', 20, null]);
      db.run('INSERT INTO Offers (title, description, couponCode) VALUES (?, ?, ?)', ['50% OFF', 'on first order', 'HUNGRY50']);
      db.run('INSERT INTO Offers (title, description, couponCode) VALUES (?, ?, ?)', ['20% OFF', 'use code SAVE20', 'SAVE20']);
      console.log('? Seeding complete!');
    }, 3000);
  });
}
seed().catch(console.error);
