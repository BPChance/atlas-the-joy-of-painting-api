const db = require('../db');

const episodeService = {
  getFilteredEpisodes: async (filters) => {
    const { month, subjects, colors, match } = filters;
    const queryParams = [];
    let whereClauses = [];

    // filter by month
    if (month) {
      queryParams.push(parseInt(month));
      whereClauses.push(`EXTRACT(MONTH FROM e.date) = $${queryParams.length}`);
    }

    // filter by subjects
    if (subjects) {
      const subjectList = subjects.split(',').map((s) => s.trim());
      const likeClauses = subjectList.map((s) => `%${s.replace(/\s+/g, '_')}%`);
      queryParams.push(likeClauses);
      whereClauses.push(`
        e.episode_id IN (
          SELECT es.episode_id
          FROM episode_subjects es
          JOIN subjects s ON es.subject_id = s.subject_id
          WHERE s.subject_name ILIKE ANY($${queryParams.length})
        )
      `);
    }

    // filter by colors used
    if (colors) {
      const colorList = colors.split(',').map((c) => c.trim());
      const likeClauses = colorList.map((c) => `%${c.replace(/\s+/g, '_')}%`);
      queryParams.push(likeClauses);
      whereClauses.push(`
        e.episode_id IN (
          SELECT ec.episode_id
          FROM episode_colors ec
          JOIN colors c ON ec.color_id = c.color_id
          WHERE c.color_name ILIKE ANY($${queryParams.length})
        )
      `);
    }

    // base query
    let queryString = `
      SELECT 
        e.episode_id,
        e.episode_number,
        e.title,
        e.date,
        (
          SELECT ARRAY_AGG(s.subject_name)
          FROM episode_subjects es
          JOIN subjects s ON es.subject_id = s.subject_id
          WHERE es.episode_id = e.episode_id
        ) AS subjects,
        (
          SELECT ARRAY_AGG(c.color_name)
          FROM episode_colors ec
          JOIN colors c ON ec.color_id = c.color_id
          WHERE ec.episode_id = e.episode_id
        ) AS colors
      FROM episodes e
    `;

    if (whereClauses.length > 0) {
      const operator = match === 'all' ? 'AND' : 'OR';
      queryString += ` WHERE ${whereClauses.join(` ${operator} `)}`;
    }

    queryString += ' ORDER BY e.episode_number;';

    return {
      text: queryString,
      values: queryParams,
    };
  },
};

module.exports = episodeService;
