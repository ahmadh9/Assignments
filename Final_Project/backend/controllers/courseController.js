// controllers/courseController.js
import pool from '../config/db.js';

export const createCourse = async (req, res) => {
  const { title, description, category_id, price, thumbnail_url } = req.body;

  try {
    const instructor_id = req.user.id; // من JWT

    const result = await pool.query(
      `INSERT INTO courses 
      (title, description, instructor_id, category_id, price, thumbnail_url) 
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *`,
      [title, description, instructor_id, category_id, price, thumbnail_url]
    );

    res.status(201).json({
      message: '✅ Course created successfully',
      course: result.rows[0]
    });
  } catch (err) {
    console.error('❌ Error creating course:', err);
    res.status(500).json({ error: 'Server error' });
  }
};
