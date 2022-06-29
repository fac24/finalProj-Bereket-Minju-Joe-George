BEGIN;

DROP TABLE IF EXISTS stations, lines, platforms, platform_exits, exit_interchanges, station_lines CASCADE;

CREATE TABLE stations (
  -- Given we've narrowed scope to TfL only, we don't need our own id column.
  -- (But if this was a real app, we'd probably want it to handle situations where
  -- external datasets, APIs etc. don't provide a uid for stations.)
  -- id SERIAL PRIMARY KEY,
  station_naptan TEXT PRIMARY KEY NOT NULL,
  common_name_short TEXT NOT NULL
);
 
-- CREATE TABLE lines (
--   id SERIAL PRIMARY KEY,
--   name TEXT NOT NULL
-- );

-- CREATE TABLE platforms (
--   id SERIAL PRIMARY KEY,
--   name TEXT NOT NULL,
--   train_direction TEXT NOT NULL,
--   station_id INTEGER REFERENCES stations(id) NOT NULL,
--   line_id INTEGER REFERENCES lines(id) NOT NULL
-- );

-- CREATE TABLE platform_exits (
--   id SERIAL PRIMARY KEY,
--   carriage INTEGER NOT NULL,
--   door INTEGER NOT NULL,
--   type INTEGER NOT NULL
-- );

-- CREATE TABLE users_feedback (
--   id SERIAL PRIMARY KEY,
--   platform_exits_id INTEGER REFERENCES platform_exits(id),
--   carriage INTEGER NOT NULL,
--   door INTEGER NOT NULL,
--   votes INTEGER NOT NULL
-- );

-- CREATE TABLE exit_interchanges (
--   id SERIAL PRIMARY KEY,
--   platform_exit_id INTEGER REFERENCES platform_exits(id) NOT NULL,
--   dest_platform_id INTEGER REFERENCES platforms(id) NOT NULL
-- );

-- CREATE TABLE station_lines (
--   id SERIAL PRIMARY KEY,
--   station_id INTEGER REFERENCES stations(id) NOT NULL,
--   line_id INTEGER REFERENCES lines(id) NOT NULL
-- );


-- INSERT INTO station (name, id) VALUES ()

COMMIT;