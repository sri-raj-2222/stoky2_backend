const { supabase } = require('../config/supabase');
const { isValidUUID } = require('../utils/validation');

/**
 * GET /api/wishlist
 * List wishlist items for authenticated user
 */
async function getWishlist(req, res, next) {
  try {
    const { data: items, error } = await supabase
      .from('wishlist')
      .select('*')
      .eq('user_id', req.userId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.json(items);
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/wishlist
 * Add an item to the wishlist
 */
async function addToWishlist(req, res, next) {
  try {
    const { product_name, product_slug, image_url, price } = req.body;

    // Validate required fields
    if (!product_name || typeof product_name !== 'string' || product_name.trim().length === 0) {
      return res.status(400).json({ error: 'product_name is required' });
    }
    if (!product_slug || typeof product_slug !== 'string' || product_slug.trim().length === 0) {
      return res.status(400).json({ error: 'product_slug is required' });
    }
    if (price === undefined || price === null || typeof price !== 'number' || price < 0) {
      return res.status(400).json({ error: 'price is required and must be a non-negative number' });
    }

    // Prevent duplicate wishlist entries for the same product
    const { data: existing, error: checkError } = await supabase
      .from('wishlist')
      .select('id')
      .eq('user_id', req.userId)
      .eq('product_slug', product_slug.trim())
      .maybeSingle();

    if (checkError) throw checkError;

    if (existing) {
      return res.status(409).json({ error: 'Product is already in your wishlist' });
    }

    const { data: item, error } = await supabase
      .from('wishlist')
      .insert({
        user_id: req.userId,
        product_name: product_name.trim(),
        product_slug: product_slug.trim(),
        image_url: image_url?.trim() || null,
        price,
      })
      .select()
      .single();

    if (error) throw error;

    res.status(201).json(item);
  } catch (err) {
    next(err);
  }
}

/**
 * DELETE /api/wishlist/:id
 * Remove an item from the wishlist
 */
async function removeFromWishlist(req, res, next) {
  try {
    const { id } = req.params;

    if (!isValidUUID(id)) {
      return res.status(400).json({ error: 'Invalid wishlist item ID format' });
    }

    const { data, error } = await supabase
      .from('wishlist')
      .delete()
      .eq('id', id)
      .eq('user_id', req.userId) // Ensures the item belongs to this user
      .select()
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({ error: 'Wishlist item not found' });
      }
      throw error;
    }

    res.json({ message: 'Removed from wishlist' });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
};
