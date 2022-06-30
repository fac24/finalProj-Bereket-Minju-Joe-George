BEGIN;

INSERT INTO platforms (tfl_public_number, tfl_public_direction_name, train_direction, station_naptan, individual_stop_id) VALUES
  (1, 'Westbound', false, '940GZZLUKSX', '9400ZZLUKSX3'),
  (3, 'Northbound', true, '940GZZLUKSX', '9400ZZLUKSX1');

INSERT INTO platform_line (platform_id, line_id) VALUES
  (1, 'circle'),
  (1, 'hammersmith-city'),
  (1, 'metropolitan'),
  (2, 'victoria');

INSERT INTO platform_exits (platform_id, carriage_from_front, door_from_front, type) VALUES
  (1, 7, 2, 2);

INSERT INTO exit_interchanges (platform_exit_id, dest_platform_id) VALUES 
  (1, 2);

INSERT INTO sessions (sid) VALUES 
  ('MYFAKESESSIONID'),
  ('anotherfakesessionid');

-- INSERT INTO routes (name) VALUES
--   ('Finsbury park to Bermondsey via Greenpark'),
--   ('Whitechapel to Finsbury park via Kings cross');

INSERT INTO routes (data) VALUES
  ('{
      "startStationNaptan": "940GZZLUKSX",
      "platformIndividualStopId": "9400ZZLUKSX1",
      "lineId": "victoria",
      "platformIndividualStopId": "9400ZZLUFPK3",
      "endStationNaptan": "9400ZZLUFPK"
  }'),
  ('{
      "startStationNaptan": "9400ZZLUFPK",
      "platformIndividualStopId": "9400ZZLUFPK4",
      "lineId": "victoria",
      "platformIndividualStopId": "9400ZZLUKSX2",
      "endStationNaptan": "940GZZLUKSX"
  }');

INSERT INTO session_routes (sid, route_id) VALUES
  ('MYFAKESESSIONID',1),
  ('anotherfakesessionid',1),
  ('anotherfakesessionid',2);

COMMIT;