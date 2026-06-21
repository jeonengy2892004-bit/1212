/* ============================================
   12:12 CAFE — SHARED CART SYSTEM
   In-memory cart, persisted only for the session (no localStorage per artifact rules).
   Exposes window.Cart12 with: items, add(), remove(), setQty(), total(), count(), subscribe()
   ============================================ */

(function(){
  const state = {
    items: {} // id -> {id, name, price, qty, category}
  };
  const listeners = [];

  function notify(){
    listeners.forEach(fn => fn(state));
  }

  function add(product, qty = 1){
    if(state.items[product.id]){
      state.items[product.id].qty += qty;
    } else {
      state.items[product.id] = {...product, qty};
    }
    notify();
  }

  function setQty(id, qty){
    if(qty <= 0){
      delete state.items[id];
    } else if(state.items[id]) {
      state.items[id].qty = qty;
    }
    notify();
  }

  function remove(id){
    delete state.items[id];
    notify();
  }

  function clear(){
    state.items = {};
    notify();
  }

  function count(){
    return Object.values(state.items).reduce((sum, i) => sum + i.qty, 0);
  }

  function total(){
    return Object.values(state.items).reduce((sum, i) => sum + i.qty * i.price, 0);
  }

  function list(){
    return Object.values(state.items);
  }

  function subscribe(fn){
    listeners.push(fn);
    fn(state);
  }

  window.Cart12 = { add, remove, setQty, clear, count, total, list, subscribe };

  /* ============================================
     CART BADGE (updates any element with [data-cart-count])
     ============================================ */
  function updateBadges(){
    const c = count();
    document.querySelectorAll('[data-cart-count]').forEach(el => {
      el.textContent = c;
      el.style.display = c > 0 ? 'flex' : 'none';
    });
  }
  window.Cart12.subscribe(updateBadges);

  document.addEventListener('DOMContentLoaded', updateBadges);
})();