const { getConnection, sql } = require('./db');

const categoryImageMap = {
  "Fresh": "https://picsum.photos/id/130/400/400",          // fresh produce
  "Summer": "https://picsum.photos/id/20/400/400",          // beach
  "Electronics": "https://picsum.photos/id/0/400/400",      // laptop
  "50% Discount": "https://picsum.photos/id/26/400/400",    // sale tag
  "Wedding": "https://picsum.photos/id/30/400/400",         // coffee (romantic)
  "Home": "https://picsum.photos/id/106/400/400",           // flowers vase
  "Fashion": "https://picsum.photos/id/96/400/400",         // mountain (clothing)
  "Beauty": "https://picsum.photos/id/13/400/400",          // lipstick
  "Kids": "https://picsum.photos/id/169/400/400",           // sun
  "Grocery": "https://picsum.photos/id/102/400/400",        // grocery
  "Pharmacy": "https://picsum.photos/id/33/400/400",        // medicine
  "Food": "https://picsum.photos/id/108/400/400",           // pasta
  "Instamart": "https://picsum.photos/id/91/400/400",       // grocery delivery
  "Dineout": "https://picsum.photos/id/62/400/400",         // restaurant
  "Gifts": "https://picsum.photos/id/129/400/400",          // gift
  "Scents": "https://picsum.photos/id/34/400/400",          // perfume
  "Vegetables": "https://picsum.photos/id/127/400/400",     // vegetables
  "Fresh Fruits": "https://picsum.photos/id/128/400/400",   // fruit
  "Dairy Bread & Eggs": "https://picsum.photos/id/121/400/400", // bread
  "Meat & Seafood": "https://picsum.photos/id/139/400/400", // meat
  "Grocery Kitchen": "https://picsum.photos/id/20/400/400", // kitchen
  "Snacks & Drinks": "https://picsum.photos/id/145/400/400", // drink
  "Beauty & Wellness": "https://picsum.photos/id/13/400/400", // skincare
  "Household Lifestyle": "https://picsum.photos/id/46/400/400", // cleaning
  "Shop by Store": "https://picsum.photos/id/96/400/400",   // store
  "Babycare Essentials": "https://picsum.photos/id/169/400/400", // baby
  "Summer Glow Essentials": "https://picsum.photos/id/20/400/400", // sun
  "Get Best Hair Day": "https://picsum.photos/id/5/400/400", // hair
  "All in One Series": "https://picsum.photos/id/0/400/400", // bundle
  "Breakfast Cereals": "https://picsum.photos/id/32/400/400", // cereal
  "Regional Pantry Picks": "https://picsum.photos/id/145/400/400", // spices
  "Best Skincare": "https://picsum.photos/id/13/400/400",   // skincare
  "Refreshing Cold Sips": "https://picsum.photos/id/97/400/400", // drink
  "Snacks Munchies": "https://picsum.photos/id/108/400/400", // snacks
  "Best Deals Cooking Essentials": "https://picsum.photos/id/102/400/400", // cooking
  "Pet Supplies": "https://picsum.photos/id/141/400/400"    // pet
};

async function updateImages() {
  const pool = await getConnection();
  console.log('Updating product images with real URLs...');
  for (const [category, imageUrl] of Object.entries(categoryImageMap)) {
    const result = await pool.request()
      .input('category', sql.NVarChar, category)
      .input('imageUrl', sql.NVarChar, imageUrl)
      .query('UPDATE Products SET imageEmoji = @imageUrl WHERE categoryId IN (SELECT categoryId FROM Categories WHERE name = @category)');
    console.log(`  ? ${category}: ${result.rowsAffected[0]} products updated`);
  }
  console.log('? All products now have real image URLs!');
  process.exit(0);
}
updateImages().catch(err => { console.error(err); process.exit(1); });
