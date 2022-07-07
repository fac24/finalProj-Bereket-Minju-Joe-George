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
  train_direction TEXT NOT NULL,
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
  dest_platform_id INTEGER REFERENCES platforms (id)
);

CREATE TABLE sessions (
  sid TEXT PRIMARY KEY
);

-- Joe todo: how can we make sure these are unique?! A UNIQUE constraint on the data column?!
CREATE TABLE routes (
  id SERIAL PRIMARY KEY,
  -- We can store routes in our own JSON format, maybe something like this:
  -- (property name: value data type)
  -- {
  --   start_station: station_naptan,
  --   platform: individual_stop_id,
  --   line: id,
  --   station: station_naptan, [could also call this interchange?]
  --   platform: individual_stop_id, [the arrival platform could go before the station, it's up to us]
  --   platform: ",
  --   end_station: station_naptan [could also be "exit_station"]
  -- }
  data JSONB UNIQUE NOT NULL -- JSONB stores it as binary but allows us to check the uniqueness of json as JSON did not allow us to.
);

-- For saving routes to individual sessions (users):
CREATE TABLE session_routes (
  sid TEXT REFERENCES sessions (sid) NOT NULL,
  route_id INTEGER REFERENCES routes (id) NOT NULL
);

CREATE TABLE platform_exits_feedback (
  id SERIAL PRIMARY KEY,
  sid TEXT REFERENCES sessions (sid) NOT NULL,
  -- The user is giving feedback on a platform exit, not a route :)
  platform_exits_id INTEGER REFERENCES platform_exits (id) NOT NULL,
  -- If the user is giving feedback on the final leg of a journey,
  -- it means they're exiting the station, so we don't need to link their
  -- feedback to an exit_interchange. But if they're on an interchange leg,
  -- we need to record their feedback about the platform_exit that's specifically
  -- related to this interchange!
  exit_interchanges_id INTEGER REFERENCES exit_interchanges (id),
  -- If the user says a route was correct(/it worked for them), record "true"
  correct BOOLEAN NOT NULL,
  new_carriage_from_front INTEGER,
  new_door_from_front INTEGER,
  new_platform_train_direction TEXT
  -- It's tricky to get feedback on side because it implies train directions/platform data is wrong!
  -- new_side 
);

-- Creating idx function that will order the return based on the input of the array rather than by the id
-- Found here - https://wiki.postgresql.org/wiki/Array_Index
CREATE OR REPLACE FUNCTION idx(anyarray, anyelement)
  RETURNS int AS 
$$
  SELECT i FROM (
     SELECT generate_series(array_lower($1,1),array_upper($1,1))
  ) g(i)
  WHERE $1[i] = $2
  LIMIT 1;
$$ LANGUAGE sql IMMUTABLE;


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