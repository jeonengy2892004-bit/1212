/* ============================================
   12:12 CAFE — SHARED PRODUCT CATALOG
   Base product data + admin overrides (price / availability) from shared storage.
   Exposes window.Catalog12 with: getAll() -> Promise<Product[]>, CATEGORY_LABELS
   ============================================ */

(function(){

  const BASE_PRODUCTS = [
    // Coffee
    {id:'spanish-latte', name:'Spanish Latte', price:95, category:'coffee', desc:'Dark espresso with steamed milk and a light caramel cream.', img:'https://images.unsplash.com/photo-1561882468-9110e03e0f78?w=500&q=80'},
    {id:'flat-white', name:'Flat White', price:90, category:'coffee', desc:'Concentrated espresso with a thin, silky layer of milk.', img:'https://images.unsplash.com/photo-1485808191679-5f86510681a2?w=500&q=80'},
    {id:'cappuccino', name:'Cappuccino', price:80, category:'coffee', desc:'Equal parts espresso, steamed milk, and airy foam.', img:'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=500&q=80'},
    {id:'americano', name:'Americano', price:70, category:'coffee', desc:'Espresso lengthened with hot water for a lighter body.', img:'https://images.unsplash.com/photo-1551030173-122aabc4489c?w=500&q=80'},
    {id:'matcha-latte', name:'Matcha Latte', price:105, category:'coffee', desc:'Premium Japanese matcha with steamed milk of your choice.', img:'https://images.unsplash.com/photo-1515823064-d6e0c04616a7?w=500&q=80'},
    {id:'mocha', name:'Mocha', price:100, category:'coffee', desc:'Espresso, steamed milk, and rich dark chocolate.', img:'https://images.unsplash.com/photo-1572286258217-215cf8e667ea?w=500&q=80'},

    // Cold Drinks
    {id:'cold-brew-1212', name:'Cold Brew 12:12', price:110, category:'cold', desc:'Steeped cold for 12 hours — smooth and bold at once.', img:'https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=500&q=80'},
    {id:'iced-latte', name:'Iced Latte', price:95, category:'cold', desc:'Chilled espresso over milk and ice, lightly sweetened.', img:'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=500&q=80'},
    {id:'iced-americano', name:'Iced Americano', price:75, category:'cold', desc:'Espresso and cold water over ice — crisp and clean.', img:'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?w=500&q=80'},
    {id:'frappe', name:'Caramel Frappé', price:120, category:'cold', desc:'Blended cold coffee with caramel and whipped cream.', img:'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=500&q=80'},
    {id:'iced-matcha', name:'Iced Matcha', price:115, category:'cold', desc:'Matcha shaken over ice with cold milk.', img:'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=500&q=80'},
    {id:'lemon-mint', name:'Lemon Mint Refresher', price:80, category:'cold', desc:'Fresh lemon and mint, lightly sweetened and chilled.', img:'https://images.unsplash.com/photo-1437418747212-8d9709afab22?w=500&q=80'},

    // Pastries
    {id:'almond-croissant', name:'Almond Croissant', price:85, category:'pastries', desc:'Crisp French pastry filled with almond cream.', img:'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=500&q=80'},
    {id:'butter-croissant', name:'Butter Croissant', price:65, category:'pastries', desc:'Classic, flaky, and baked fresh every morning.', img:'https://images.unsplash.com/photo-1623334044303-241021148842?w=500&q=80'},
    {id:'pain-au-chocolat', name:'Pain au Chocolat', price:75, category:'pastries', desc:'Buttery pastry layered with dark chocolate batons.', img:'https://images.unsplash.com/photo-1623334044302-997eec476fc6?w=500&q=80'},
    {id:'cinnamon-roll', name:'Cinnamon Roll', price:90, category:'pastries', desc:'Soft roll swirled with cinnamon and a light glaze.', img:'https://images.unsplash.com/photo-1593200527637-c47f87c4f7c9?w=500&q=80'},

    // Desserts
    {id:'cheesecake-honey', name:'Honey Cheesecake', price:130, category:'desserts', desc:'Burnt biscuit base with a silky, creamy cheese layer.', img:'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=500&q=80'},
    {id:'chocolate-fondant', name:'Chocolate Fondant', price:120, category:'desserts', desc:'Warm cake with a molten dark chocolate center.', img:'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=500&q=80'},
    {id:'tiramisu', name:'Tiramisu', price:125, category:'desserts', desc:'Espresso-soaked layers with mascarpone cream.', img:'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=500&q=80'},
    {id:'carrot-cake', name:'Carrot Cake', price:110, category:'desserts', desc:'Spiced carrot cake with cream cheese frosting.', img:'https://images.unsplash.com/photo-1621303837174-89787a7d4729?w=500&q=80'}
  ];

  const CATEGORY_LABELS = {coffee:'Coffee', cold:'Cold Drinks', pastries:'Pastries', desserts:'Desserts'};

  // overrides shape: { [productId]: { price?: number, outOfStock?: boolean } }
  async function getOverrides(){
    return await window.FirebaseDB.getOverrides();
  }

  async function saveOverrides(overrides){
    return await window.FirebaseDB.saveOverrides(overrides);
  }

  async function getAll(){
    const overrides = await getOverrides();
    return BASE_PRODUCTS.map(p => {
      const ov = overrides[p.id] || {};
      return {
        ...p,
        price: typeof ov.price === 'number' ? ov.price : p.price,
        outOfStock: !!ov.outOfStock
      };
    });
  }

  async function setOverride(id, patch){
    const overrides = await getOverrides();
    overrides[id] = {...(overrides[id] || {}), ...patch};
    await saveOverrides(overrides);
  }

  window.Catalog12 = {
    BASE_PRODUCTS,
    CATEGORY_LABELS,
    getAll,
    getOverrides,
    setOverride
  };

})();