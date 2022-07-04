BEGIN;

INSERT INTO platforms (tfl_public_number, tfl_public_direction_name, train_direction, station_naptan, individual_stop_id) VALUES
  (1, 'Westbound', 'left', '940GZZLUKSX', '9400ZZLUKSX3'),
  (3, 'Northbound', 'right', '940GZZLUKSX', '9400ZZLUKSX1'),
  (1,'Eastbound','left','940GZZLUWTA','9400ZZLUWTA1'), -- westacton
  (1,'Eastbound', 'left', '940GZZLUOXC','9400ZZLUOXC1'), --oxford circus central
  (6,'Southbound', 'left', '940GZZLUOXC', '9400ZZLUOXC6'), --oxford circus victoria
  (3,'Southbound', 'left', '940GZZLUVIC', '9400ZZLUVIC3'), --Victoria hmm needs thinking about for the terminii stations
  (2, 'Northbound', 'left', '940GZZLUFPK', '9400ZZLUFPK3')
  ;

INSERT INTO platform_line (platform_id, line_id) VALUES
  (1, 'circle'),
  (1, 'hammersmith-city'),
  (1, 'metropolitan'),
  (2, 'victoria'),
  (3, 'central'),
  (4, 'central'),
  (5, 'victoria'),
  (6, 'victoria');

INSERT INTO platform_exits (platform_id, carriage_from_front, door_from_front, type) VALUES
  (1, 7, 2, 2),
  (4, 4, 2, 1),
  (6, 2, 1, 0),
  (7, 4, 4, 0);

INSERT INTO exit_interchanges (platform_exit_id, dest_platform_id) VALUES 
  (1, 2),
  (2, 5);

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