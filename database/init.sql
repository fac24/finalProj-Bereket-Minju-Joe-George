BEGIN;

DROP TABLE IF EXISTS stations, lines, platforms, platform_line, platform_exits, exit_interchanges, sessions, routes, session_routes CASCADE;

-- For now, stations will be populated by our script scraping TfL API.
CREATE TABLE stations (
  -- Given we've narrowed scope to TfL only, we don't need our own id column.
  -- (But if this was a real app, we'd probably want it to handle situations where
  -- external datasets, APIs etc. don't provide a uid for stations.)
  -- id SERIAL PRIMARY KEY,
  station_naptan TEXT PRIMARY KEY NOT NULL,
  common_name_short TEXT NOT NULL
);

-- Lines populated by our script scraping TfL API.
CREATE TABLE lines (
  -- Straight from TfL basically.
  id TEXT PRIMARY KEY, -- lowercase, hyphens
  name TEXT NOT NULL -- nicer for humans to read :)
);

-- For now, we add all platform data ourselves. (Just a few examples to work with!)
CREATE TABLE platforms (
  id SERIAL PRIMARY KEY,
  -- Platform number we can research. These apparently can be non-existent in the real world.
  -- (In which case the platforms just have a name.)
  -- They might differ from TfL's "internal" platform numbering system?!
  tfl_public_number INTEGER,
  tfl_public_direction_name TEXT, -- northbound, southbound, etc.
  -- Tran direction can only be from the left or right (when on platform, facing tracks).
  -- So make this a boolean: true = from the right, false = from the left.
  -- (See a note in Figma about possible exceptions which our app wil ignore!) :D
  train_direction BOOLEAN NOT NULL,
  station_naptan TEXT REFERENCES stations (station_naptan) NOT NULL,
  -- Can't find any documentation on this, but seems to uniquely identify platforms?
  -- We COULD use this instead of id above, as it's a unique identifier (hopefully!).
  individual_stop_id TEXT NOT NULL UNIQUE
);

-- One platform can serve many lines! (e.g. H&C/Circle/Met)
CREATE TABLE platform_line (
  id SERIAL PRIMARY KEY,
  platform_id INTEGER REFERENCES platforms (id) NOT NULL,
  line_id TEXT REFERENCES lines (id) NOT NULL
);

CREATE TABLE platform_exits (
  id SERIAL PRIMARY KEY,
  platform_id INTEGER REFERENCES platforms (id) NOT NULL,
  carriage_from_front INTEGER NOT NULL, -- from front of train. 1 indexed, i.e. the first carriage is number 1
  door_from_front INTEGER NOT NULL, -- from front of carriage. Also 1 indexed
  type INTEGER NOT NULL -- 0 = exit, 1 = interchange, 2 = both?. (Future-proof? e.g. 3 = lift, etc.)
);

CREATE TABLE exit_interchanges (
  id SERIAL PRIMARY KEY,
  platform_exit_id INTEGER REFERENCES platform_exits (id) NOT NULL,
  dest_platform_id INTEGER REFERENCES platforms (id) NOT NULL
);

CREATE TABLE sessions (
  sid TEXT PRIMARY KEY
);

CREATE TABLE routes (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL
);

CREATE TABLE  session_routes (
  sid TEXT REFERENCES sessions (sid) NOT NULL,
  route_id INTEGER REFERENCES routes (id) NOT NULL
);

-- CREATE TABLE users_feedback (
--   id SERIAL PRIMARY KEY,
--   platform_exits_id INTEGER REFERENCES platform_exits(id),
--   carriage INTEGER NOT NULL,
--   door INTEGER NOT NULL,
--   votes INTEGER NOT NULL
-- );

-- Joe: I don't think we need this if we're using TfL's API for journey planning?
-- CREATE TABLE station_lines (
--   id SERIAL PRIMARY KEY,
--   station_id INTEGER REFERENCES stations(id) NOT NULL,
--   line_id INTEGER REFERENCES lines(id) NOT NULL
-- );

COMMIT;