BEGIN;

DROP TABLE IF EXISTS stations, lines, platforms, platform_exits, exit_interchanges, station_lines CASCADE;

CREATE TABLE stations(
  id SERIAL PRIMARY KEY,
  name TEXT
);

CREATE TABLE lines(
  id SERIAL PRIMARY KEY,
  name TEXT
);

CREATE TABLE platforms (
  id SERIAL PRIMARY KEY,
  name TEXT,
  train_direction TEXT,
  station_id INTEGER REFERENCES stations(id),
  line_id INTEGER REFERENCES lines(id)
);

CREATE TABLE platform_exits (
  id SERIAL PRIMARY KEY,
  carriage INTEGER,
  door INTEGER,
  type INTEGER
);

CREATE TABLE exit_interchanges (
  id SERIAL PRIMARY KEY,
  platform_exit_id INTEGER REFERENCES platform_exits(id),
  dest_platform_id INTEGER REFERENCES platforms(id)
);

CREATE TABLE station_lines (
  id SERIAL PRIMARY KEY,
  station_id INTEGER REFERENCES stations(id),
  line_id INTEGER REFERENCES lines(id)
);

COMMIT;