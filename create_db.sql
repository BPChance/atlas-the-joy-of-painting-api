-- episodes table
CREATE TABLE episodes (
    episode_id SERIAL PRIMARY KEY,
    episode_number INTEGER NOT NULL UNIQUE,
    title VARCHAR(255) NOT NULL,
    broadcast_date DATE NOT NULL,
    youtube_url VARCHAR(255)
);

-- index for filtering by month
CREATE INDEX idx_episodes_broadcast_month ON episodes (EXTRACT(MONTH FROM broadcast_date));

-- subjects table
CREATE TABLE subjects (
    subject_id SERIAL PRIMARY KEY,
    subject_name VARCHAR(255) NOT NULL UNIQUE
);

-- episode_subjects join table
CREATE TABLE episode_subjects (
    episode_id INTEGER NOT NULL REFERENCES episodes(episode_id) ON DELETE CASCADE,
    subject_id INTEGER NOT NULL REFERENCES subjects(subject_id) ON DELETE CASCADE,
    PRIMARY KEY (episode_id, subject_id)
);

-- colors table
CREATE TABLE colors (
    color_id SERIAL PRIMARY KEY,
    color_name VARCHAR(255) NOT NULL UNIQUE
);

-- episode_colors join table
CREATE TABLE episode_colors (
    episode_id INTEGER NOT NULL REFERENCES episodes(episode_id) ON DELETE CASCADE,
    color_id INTEGER NOT NULL REFERENCES colors(color_id) ON DELETE CASCADE,
    PRIMARY KEY (episode_id, color_id)
);

-- indexes
CREATE INDEX idx_episode_subjects_subject_id ON episode_subjects(subject_id);
CREATE INDEX idx_episode_colors_color_id ON episode_colors(color_id);