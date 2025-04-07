const fs = require('fs');
const csv = require('csv-parser');
const { Client } = require('pg');
const { Pool } = require('pg');

const dataFile = '../datasets/MergedCleanedData.csv';

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  user: 'braden',
  password: 'braden',
  database: 'joy_of_painting',
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

async function importData() {
  const client = await pool.connect();

  try {
    const rows = [];

    // read data into memory
    await new Promise((resolve, reject) => {
      fs.createReadStream(dataFile)
        .pipe(csv())
        .on('data', (row) => rows.push(row))
        .on('end', resolve)
        .on('error', reject);
    });

    // process batches
    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      await client.query('BEGIN');

      try {
        // insert eps
        const episodeRes = await client.query(
          `INSERT INTO episodes (episode_number, title, date) 
           VALUES ($1, $2, $3) RETURNING episode_id`,
          [i + 1, row.TITLE, row.EPISODE_DATE]
        );
        const episodeId = episodeRes.rows[0].episode_id;

        // process colors
        const colors = row.COLORS_USED.split(',').map((c) => c.trim());
        for (const color of colors) {
          const colorRes = await client.query(
            `WITH ins AS (
              INSERT INTO colors (color_name) 
              VALUES ($1) ON CONFLICT (color_name) DO NOTHING 
              RETURNING color_id
             )
             SELECT color_id FROM ins
             UNION ALL
             SELECT color_id FROM colors WHERE color_name = $1 
             LIMIT 1`,
            [color]
          );
          await client.query(
            'INSERT INTO episode_colors (episode_id, color_id) VALUES ($1, $2)',
            [episodeId, colorRes.rows[0].color_id]
          );
        }

        // process subjects
        const subjects = row.SUBJECT_MATTER.split(',').map((s) => s.trim());
        for (const subject of subjects) {
          const subjectRes = await client.query(
            `WITH ins AS (
              INSERT INTO subjects (subject_name) 
              VALUES ($1) ON CONFLICT (subject_name) DO NOTHING 
              RETURNING subject_id
             )
             SELECT subject_id FROM ins
             UNION ALL
             SELECT subject_id FROM subjects WHERE subject_name = $1 
             LIMIT 1`,
            [subject]
          );
          await client.query(
            'INSERT INTO episode_subjects (episode_id, subject_id) VALUES ($1, $2)',
            [episodeId, subjectRes.rows[0].subject_id]
          );
        }

        await client.query('COMMIT');
        console.log(`Inserted episode ${i + 1}: ${row.TITLE}`);
      } catch (err) {
        await client.query('ROLLBACK');
        console.error(`Error in episode ${i + 1} (${row.TITLE}):`, err.message);
      }
    }
  } finally {
    client.release();
    await pool.end();
  }
}

importData()
  .then(() => console.log('Import complete'))
  .catch((err) => console.error('Import failed:', err));
