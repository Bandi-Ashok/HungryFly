const { getConnection, sql } = require('../db');
const bcrypt = require('bcrypt');

const categoryConfig = [
  { name:'Fresh', icon:'??', subcats:['Vegetables','Fruits','Herbs'], productBase:{priceRange:[20,200], rating:4.2, image:'??'} },
  { name:'Summer', icon:'??', subcats:['Coolers','Sunscreen','Summer Wear'], productBase:{priceRange:[100,800], rating:4.3, image:'???'} },
  { name:'Electronics', icon:'??', subcats:['Mobiles','Laptops','Audio','Accessories'], productBase:{priceRange:[500,150000], rating:4.4, image:'??'} },
  { name:'50% Discount', icon:'???', subcats:['All Items'], productBase:{priceRange:[50,2000], discount:50, image:'??'} },
  { name:'Wedding', icon:'??', subcats:['Jewelry','Clothing','Gifts'], productBase:{priceRange:[500,50000], rating:4.5, image:'??'} },
  { name:'Home', icon:'??', subcats:['Furniture','Decor','Kitchen'], productBase:{priceRange:[300,20000], rating:4.2, image:'???'} },
  { name:'Fashion', icon:'??', subcats:['Men','Women','Kids','Accessories'], productBase:{priceRange:[400,5000], rating:4.3, image:'??'} },
  { name:'Beauty', icon:'??', subcats:['Skincare','Makeup','Haircare'], productBase:{priceRange:[150,3000], rating:4.4, image:'??'} },
  { name:'Kids', icon:'??', subcats:['Toys','Clothing','School'], productBase:{priceRange:[200,2000], rating:4.5, image:'??'} },
  { name:'Grocery', icon:'??', subcats:['Staples','Snacks','Beverages'], productBase:{priceRange:[30,500], rating:4.3, image:'??'} },
  { name:'Pharmacy', icon:'??', subcats:['Medicines','Wellness','Personal Care'], productBase:{priceRange:[50,1000], rating:4.6, image:'??'} },
  { name:'Food', icon:'??', subcats:['Pizza','Burger','Biryani','Chinese'], productBase:{priceRange:[150,600], rating:4.3, image:'??'} },
  { name:'Instamart', icon:'?', subcats:['Groceries','Essentials','Snacks'], productBase:{priceRange:[40,800], rating:4.4, image:'??'} },
  { name:'Dineout', icon:'???', subcats:['Restaurants','Cafes','Bars'], productBase:{priceRange:[500,3000], rating:4.2, image:'??'} },
  { name:'Gifts', icon:'??', subcats:['Personalized','Flowers','Cakes'], productBase:{priceRange:[300,2000], rating:4.5, image:'??'} },
  { name:'Scents', icon:'??', subcats:['Perfumes','Deodorants','Candles'], productBase:{priceRange:[200,3000], rating:4.3, image:'??'} },
  { name:'Vegetables', icon:'??', subcats:['Fresh','Organic','Exotic'], productBase:{priceRange:[20,150], rating:4.5, image:'??'} },
  { name:'Fresh Fruits', icon:'??', subcats:['Apples','Bananas','Berries'], productBase:{priceRange:[30,300], rating:4.6, image:'??'} },
  { name:'Dairy Bread & Eggs', icon:'??', subcats:['Milk','Bread','Eggs','Cheese'], productBase:{priceRange:[20,200], rating:4.4, image:'??'} },
  { name:'Meat & Seafood', icon:'??', subcats:['Chicken','Mutton','Fish','Prawns'], productBase:{priceRange:[200,800], rating:4.3, image:'??'} },
  { name:'Grocery Kitchen', icon:'??', subcats:['Utensils','Appliances','Storage'], productBase:{priceRange:[100,3000], rating:4.2, image:'??'} },
  { name:'Snacks & Drinks', icon:'??', subcats:['Chips','Biscuits','Soft Drinks'], productBase:{priceRange:[20,150], rating:4.3, image:'??'} },
  { name:'Beauty & Wellness', icon:'??', subcats:['Skincare','Supplements'], productBase:{priceRange:[200,2000], rating:4.5, image:'?'} },
  { name:'Household Lifestyle', icon:'??', subcats:['Cleaning','Laundry','Tools'], productBase:{priceRange:[100,1500], rating:4.1, image:'??'} },
  { name:'Shop by Store', icon:'??', subcats:['Brands','Local Stores'], productBase:{priceRange:[100,5000], rating:4.0, image:'??'} },
  { name:'Babycare Essentials', icon:'??', subcats:['Diapers','Feeding','Bath'], productBase:{priceRange:[200,1500], rating:4.7, image:'??'} },
  { name:'Summer Glow Essentials', icon:'?', subcats:['Sunscreen','Moisturizer','Serum'], productBase:{priceRange:[300,1200], rating:4.5, image:'??'} },
  { name:'Get Best Hair Day', icon:'??', subcats:['Shampoo','Conditioner','Oil'], productBase:{priceRange:[150,800], rating:4.4, image:'??'} },
  { name:'All in One Series', icon:'??', subcats:['Combos','Kits'], productBase:{priceRange:[500,2500], rating:4.3, image:'??'} },
  { name:'Breakfast Cereals', icon:'??', subcats:['Oats','Muesli','Cornflakes'], productBase:{priceRange:[100,400], rating:4.4, image:'??'} },
  { name:'Regional Pantry Picks', icon:'???', subcats:['South Indian','North Indian','Snacks'], productBase:{priceRange:[50,300], rating:4.5, image:'??'} },
  { name:'Best Skincare', icon:'??', subcats:['Cleanser','Moisturizer','Serum'], productBase:{priceRange:[300,2000], rating:4.6, image:'??'} },
  { name:'Refreshing Cold Sips', icon:'??', subcats:['Juices','Mocktails','Iced Tea'], productBase:{priceRange:[40,200], rating:4.3, image:'??'} },
  { name:'Snacks Munchies', icon:'??', subcats:['Chips','Nachos','Popcorn'], productBase:{priceRange:[20,100], rating:4.2, image:'??'} },
  { name:'Best Deals Cooking Essentials', icon:'??', subcats:['Oil','Spices','Grains'], productBase:{priceRange:[50,500], discount:30, image:'??'} },
  { name:'Pet Supplies', icon:'??', subcats:['Dog Food','Cat Food','Accessories'], productBase:{priceRange:[150,2000], rating:4.5, image:'??'} }
];

async function seed() {
  const pool = await getConnection();
  console.log('?? Seeding 35+ categories...');
  await pool.request().query('DELETE FROM OrderItems; DELETE FROM Orders; DELETE FROM CartItems; DELETE FROM Products; DELETE FROM Subcategories; DELETE FROM Categories; DELETE FROM Users; DELETE FROM Coupons; DELETE FROM Offers;');
  
  for (let cat of categoryConfig) {
    const catResult = await pool.request()
      .input('name', sql.NVarChar, cat.name)
      .input('icon', sql.NVarChar, cat.icon)
      .query('INSERT INTO Categories (name, icon) OUTPUT INSERTED.categoryId VALUES (@name, @icon)');
    const catId = catResult.recordset[0].categoryId;
    for (let sub of cat.subcats) {
      await pool.request()
        .input('categoryId', sql.Int, catId)
        .input('name', sql.NVarChar, sub)
        .query('INSERT INTO Subcategories (categoryId, name) VALUES (@categoryId, @name)');
    }
  }

  console.log('?? Generating products (this may take 20-30 seconds)...');
  for (let cat of categoryConfig) {
    const catRes = await pool.request()
      .input('name', sql.NVarChar, cat.name)
      .query('SELECT categoryId FROM Categories WHERE name = @name');
    const catId = catRes.recordset[0].categoryId;
    const subRes = await pool.request()
      .input('catId', sql.Int, catId)
      .query('SELECT subcategoryId, name FROM Subcategories WHERE categoryId = @catId');
    const subMap = {};
    subRes.recordset.forEach(s => { subMap[s.name] = s.subcategoryId; });
    const productsCount = cat.subcats.length * 30 + 40;
    for (let i = 0; i < productsCount; i++) {
      const subName = cat.subcats[i % cat.subcats.length];
      const subId = subMap[subName];
      const base = cat.productBase;
      const price = Math.floor(Math.random() * (base.priceRange[1] - base.priceRange[0]) + base.priceRange[0]);
      const discount = base.discount || (Math.random() > 0.7 ? Math.floor(Math.random() * 30) + 10 : 0);
      const rating = (base.rating + (Math.random() * 0.6 - 0.3)).toFixed(1);
      const isPopular = i < 15 ? 1 : 0;
      const productName = `${subName} ${['Premium','Classic','Organic','Fresh','Deluxe'][i%5]} ${i+1}`;
      await pool.request()
        .input('categoryId', sql.Int, catId)
        .input('subcategoryId', sql.Int, subId)
        .input('name', sql.NVarChar, productName)
        .input('price', sql.Decimal(10,2), price)
        .input('rating', sql.Decimal(2,1), rating)
        .input('imageEmoji', sql.NVarChar, base.image || '??')
        .input('discountPercent', sql.Int, discount)
        .input('isPopular', sql.Bit, isPopular)
        .query('INSERT INTO Products (categoryId, subcategoryId, name, price, rating, imageEmoji, discountPercent, isPopular) VALUES (@categoryId, @subcategoryId, @name, @price, @rating, @imageEmoji, @discountPercent, @isPopular)');
    }
    console.log(`  ? ${cat.name} done`);
  }

  const hashed = await bcrypt.hash('123456', 10);
  await pool.request()
    .input('mobile', sql.VarChar, '9876543210')
    .input('hash', sql.VarChar, hashed)
    .input('name', sql.NVarChar, 'Rahul Kumar')
    .input('address', sql.NVarChar, 'MG Road, Bangalore')
    .query('INSERT INTO Users (mobile, passwordHash, name, address) VALUES (@mobile, @hash, @name, @address)');

  await pool.request().query("INSERT INTO Coupons (code, description, discountPercent, maxDiscountAmount) VALUES ('HUNGRY50', '50% off up to ?100', 50, 100), ('SAVE20', '20% off on total', 20, NULL)");
  await pool.request().query("INSERT INTO Offers (title, description, couponCode) VALUES ('50% OFF', 'on first order', 'HUNGRY50'), ('20% OFF', 'use code SAVE20', 'SAVE20')");

  console.log('? Seeding complete! (5000+ products)');
  process.exit(0);
}
seed().catch(err => { console.error(err); process.exit(1); });
