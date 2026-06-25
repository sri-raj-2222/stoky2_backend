const { supabase } = require('../config/supabase');

/**
 * GET /api/profile
 * Retrieve authenticated user profile
 */
async function getProfile(req, res, next) {
  try {
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', req.userId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({ error: 'Profile not found' });
      }
      throw error;
    }

    res.json(profile);
  } catch (err) {
    next(err);
  }
}

/**
 * PUT /api/profile
 * Update authenticated user profile fields
 */
async function updateProfile(req, res, next) {
  try {
    const { full_name, phone, avatar_url, gender, date_of_birth } = req.body;

    // Build update payload with only provided fields
    const updates = {};
    if (full_name !== undefined) {
      if (typeof full_name !== 'string' || full_name.trim().length === 0) {
        return res.status(400).json({ error: 'full_name must be a non-empty string' });
      }
      if (full_name.length > 200) {
        return res.status(400).json({ error: 'full_name must be 200 characters or fewer' });
      }
      updates.full_name = full_name.trim();
    }
    if (phone !== undefined) {
      if (typeof phone !== 'string' || phone.length > 20) {
        return res.status(400).json({ error: 'phone must be a string of 20 characters or fewer' });
      }
      updates.phone = phone.trim();
    }
    if (avatar_url !== undefined) {
      if (typeof avatar_url !== 'string' || avatar_url.length > 2048) {
        return res.status(400).json({ error: 'avatar_url must be a string of 2048 characters or fewer' });
      }
      updates.avatar_url = avatar_url.trim();
    }
    if (gender !== undefined) {
      if (typeof gender !== 'string') {
        return res.status(400).json({ error: 'gender must be a string' });
      }
      updates.gender = gender.trim();
    }
    if (date_of_birth !== undefined) {
      if (date_of_birth && typeof date_of_birth !== 'string') {
        return res.status(400).json({ error: 'date_of_birth must be a string' });
      }
      updates.date_of_birth = date_of_birth ? date_of_birth.trim() : null;
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ error: 'No valid fields provided for update' });
    }

    updates.updated_at = new Date().toISOString();

    let { data: profile, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', req.userId)
      .select()
      .single();

    // Fallback if missing schema columns
    if (error) {
      console.warn("Full update failed in backend, falling back to core fields...", error.message || error);
      
      const coreUpdates = {};
      if (updates.full_name !== undefined) coreUpdates.full_name = updates.full_name;
      if (updates.phone !== undefined) coreUpdates.phone = updates.phone;
      if (updates.avatar_url !== undefined) coreUpdates.avatar_url = updates.avatar_url;
      coreUpdates.updated_at = updates.updated_at;

      const fallbackResult = await supabase
        .from('profiles')
        .update(coreUpdates)
        .eq('id', req.userId)
        .select()
        .single();

      error = fallbackResult.error;
      profile = fallbackResult.data;
    }

    if (error) throw error;

    res.json(profile);
  } catch (err) {
    next(err);
  }
}

/**
 * DELETE /api/profile
 * Delete authenticated user's account permanently from auth and database
 */
async function deleteProfile(req, res, next) {
  try {
    const { error } = await supabase.auth.admin.deleteUser(req.userId);

    if (error) throw error;

    res.json({ message: 'Account deleted successfully' });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getProfile,
  updateProfile,
  deleteProfile,
};
