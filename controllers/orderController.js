const { supabase } = require('../config/supabase');
const { isValidUUID } = require('../utils/validation');

/**
 * GET /api/orders
 * List all orders for the authenticated user (paginated)
 */
async function getOrders(req, res, next) {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit, 10) || 10));
    const offset = (page - 1) * limit;

    // Get total count
    const { count, error: countError } = await supabase
      .from('orders')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', req.userId);

    if (countError) throw countError;

    // Get paginated orders with their items
    const { data: orders, error: ordersError } = await supabase
      .from('orders')
      .select('*, order_items(*)')
      .eq('user_id', req.userId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (ordersError) throw ordersError;

    const total = count || 0;
    res.json({
      orders,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/orders/:id
 * Single order detail by order ID
 */
async function getOrderById(req, res, next) {
  try {
    const { id } = req.params;

    if (!isValidUUID(id)) {
      return res.status(400).json({ error: 'Invalid order ID format' });
    }

    const { data: order, error } = await supabase
      .from('orders')
      .select('*, order_items(*)')
      .eq('id', id)
      .eq('user_id', req.userId) // Ensures the order belongs to this user
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({ error: 'Order not found' });
      }
      throw error;
    }

    res.json(order);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getOrders,
  getOrderById,
};
