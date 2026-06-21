/* ============================================
   12:12 CAFE — TELEGRAM ORDER NOTIFICATIONS
   Sends a formatted message to the cafe owner's Telegram bot
   the moment a customer places an order. No manual step for the customer.

   ⚠️ SETUP REQUIRED — fill these two values in before going live:
   1. BOT_TOKEN — from @BotFather in Telegram (see setup guide you were given)
   2. CHAT_ID   — your personal or group chat ID (from the getUpdates step)

   NOTE ON SECURITY:
   These values are visible to anyone who views this file's source.
   That's an accepted tradeoff for this static-site setup — the worst-case
   risk is someone spamming messages to this bot, not access to anything
   sensitive (no customer payment data is ever sent through Telegram).
   When you're ready for a more secure setup, this logic should move
   behind a real backend server instead of running in the browser.
   ============================================ */

(function(){

  // ====== FILL THESE IN ======
  const BOT_TOKEN = '8957496115:AAE2nskIWIRh22EsmMM84rrC3dMumkYl6-o';   // e.g. '123456789:ABCdefGhIJKlmNoPQRsTUVwxyZ'
  const CHAT_ID   = '8131635425';     // e.g. '987654321'
  // ============================

  function formatMessage(order){
    const lines = [];
    lines.push(`🔔 *New Order — #${order.orderId}*`);
    lines.push('');
    lines.push(`👤 ${order.fullName}`);
    lines.push(`📞 ${order.phone}`);
    lines.push(`📍 ${order.address}, ${order.area}`);
    if(order.notes){
      lines.push(`📝 Notes: ${order.notes}`);
    }
    lines.push('');
    lines.push('🛒 *Items:*');
    order.items.forEach(item => {
      lines.push(`• ${item.name} ×${item.qty} — EGP ${item.price * item.qty}`);
    });
    lines.push('');
    lines.push(`🚚 Delivery: EGP ${order.deliveryFee}`);
    lines.push(`💰 *Total: EGP ${order.total}*`);
    return lines.join('\n');
  }

  async function send(order){
    if(BOT_TOKEN === 'YOUR_BOT_TOKEN_HERE' || CHAT_ID === 'YOUR_CHAT_ID_HERE'){
      console.warn('[TelegramOrders] Bot token / chat ID not configured yet. Order was not sent:', order);
      return false;
    }

    const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
    const text = formatMessage(order);

    try{
      const res = await fetch(url, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          chat_id: CHAT_ID,
          text: text,
          parse_mode: 'Markdown'
        })
      });
      const data = await res.json();
      if(!data.ok){
        console.error('[TelegramOrders] Telegram API error:', data);
        return false;
      }
      return true;
    } catch(err){
      console.error('[TelegramOrders] Network error sending order:', err);
      return false;
    }
  }

  window.TelegramOrders = { send, formatMessage };

})();