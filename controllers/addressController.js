const { supabase } = require('../config/supabase');
const { isValidUUID } = require('../utils/validation');

/**
 * GET /api/addresses
 * List user addresses sorted by default status and creation date
 */
async function getAddresses(req, res, next) {
  try {
    const { data: addresses, error } = await supabase
      .from('addresses')
      .select('*')
      .eq('user_id', req.userId)
      .order('is_default', { ascending: false })
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.json(addresses);
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/addresses
 * Create a new user address
 */
async function createAddress(req, res, next) {
  try {
    const { label, full_name, address_line1, address_line2, city, state, postal_code, country, phone, is_default } = req.body;

    // Validate required fields
    const requiredFields = { full_name, address_line1, city, state, postal_code, country, phone };
    for (const [field, value] of Object.entries(requiredFields)) {
      if (!value || typeof value !== 'string' || value.trim().length === 0) {
        return res.status(400).json({ error: `${field} is required and must be a non-empty string` });
      }
    }

    // If this address is set as default, unset the current default first
    if (is_default) {
      await supabase
        .from('addresses')
        .update({ is_default: false })
        .eq('user_id', req.userId)
        .eq('is_default', true);
    }

    const { data: address, error } = await supabase
      .from('addresses')
      .insert({
        user_id: req.userId,
        label: label?.trim() || null,
        full_name: full_name.trim(),
        address_line1: address_line1.trim(),
        address_line2: address_line2?.trim() || null,
        city: city.trim(),
        state: state.trim(),
        postal_code: postal_code.trim(),
        country: country.trim(),
        phone: phone.trim(),
        is_default: !!is_default,
      })
      .select()
      .single();

    if (error) throw error;

    res.status(201).json(address);
  } catch (err) {
    next(err);
  }
}

/**
 * PUT /api/addresses/:id
 * Update an existing user address
 */
async function updateAddress(req, res, next) {
  try {
    const { id } = req.params;

    if (!isValidUUID(id)) {
      return res.status(400).json({ error: 'Invalid address ID format' });
    }

    const { label, full_name, address_line1, address_line2, city, state, postal_code, country, phone, is_default } = req.body;

    // Build update payload with only provided fields
    const updates = {};
    const stringFields = { label, full_name, address_line1, address_line2, city, state, postal_code, country, phone };

    for (const [field, value] of Object.entries(stringFields)) {
      if (value !== undefined) {
        if (typeof value !== 'string') {
          return res.status(400).json({ error: `${field} must be a string` });
        }
        updates[field] = value.trim() || null;
      }
    }

    if (is_default !== undefined) {
      updates.is_default = !!is_default;

      // If setting as default, unset the current default first
      if (is_default) {
        await supabase
          .from('addresses')
          .update({ is_default: false })
          .eq('user_id', req.userId)
          .eq('is_default', true);
      }
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ error: 'No valid fields provided for update' });
    }

    updates.updated_at = new Date().toISOString();

    const { data: address, error } = await supabase
      .from('addresses')
      .update(updates)
      .eq('id', id)
      .eq('user_id', req.userId) // Ensures the address belongs to this user
      .select()
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({ error: 'Address not found' });
      }
      throw error;
    }

    res.json(address);
  } catch (err) {
    next(err);
  }
}

/**
 * DELETE /api/addresses/:id
 * Delete a user address
 */
async function deleteAddress(req, res, next) {
  try {
    const { id } = req.params;

    if (!isValidUUID(id)) {
      return res.status(400).json({ error: 'Invalid address ID format' });
    }

    const { data, error } = await supabase
      .from('addresses')
      .delete()
      .eq('id', id)
      .eq('user_id', req.userId) // Ensures the address belongs to this user
      .select()
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({ error: 'Address not found' });
      }
      throw error;
    }

    res.json({ message: 'Address deleted successfully' });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getAddresses,
  createAddress,
  updateAddress,
  deleteAddress,
};
