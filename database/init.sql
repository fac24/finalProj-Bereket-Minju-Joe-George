BEGIN;

DROP TABLE IF EXISTS stations, lines, platforms, platform_exits, exit_interchanges, station_lines CASCADE;

CREATE TABLE stations(
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL
);

CREATE TABLE lines(
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL
);

CREATE TABLE platforms (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  train_direction TEXT NOT NULL,
  station_id INTEGER REFERENCES stations(id) NOT NULL,
  line_id INTEGER REFERENCES lines(id) NOT NULL
);

CREATE TABLE platform_exits (
  id SERIAL PRIMARY KEY,
  carriage INTEGER NOT NULL,
  door INTEGER NOT NULL,
  type INTEGER NOT NULL
);

CREATE TABLE exit_interchanges (
  id SERIAL PRIMARY KEY,
  platform_exit_id INTEGER REFERENCES platform_exits(id) NOT NULL,
  dest_platform_id INTEGER REFERENCES platforms(id) NOT NULL
);

CREATE TABLE station_lines (
  id SERIAL PRIMARY KEY,
  station_id INTEGER REFERENCES stations(id) NOT NULL,
  line_id INTEGER REFERENCES lines(id) NOT NULL
);


-- INSERT INTO station (name, id) VALUES ()

COMMIT;