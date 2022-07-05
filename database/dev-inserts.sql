BEGIN;

INSERT INTO platforms (tfl_public_number, tfl_public_direction_name, train_direction, station_naptan, individual_stop_id) VALUES
  (1, 'Westbound', 'left', '940GZZLUKSX', '9400ZZLUKSX3'), -- Kings X Circle, h+m, Met
  (3, 'Northbound', 'right', '940GZZLUKSX', '9400ZZLUKSX1'), -- King X victoria line
  (1, 'Eastbound', 'left','940GZZLUWTA', '9400ZZLUWTA1'), -- westacton
  (1, 'Eastbound', 'left', '940GZZLUOXC', '9400ZZLUOXC1'), --oxford circus central
  (6, 'Southbound', 'left', '940GZZLUOXC', '9400ZZLUOXC6'), --oxford circus victoria
  (3, 'Southbound', 'left', '940GZZLUVIC', '9400ZZLUVIC3'), --Victoria hmm needs thinking about for the terminii stations
  (2, 'Northbound', 'left', '940GZZLUFPK', '9400ZZLUFPK3'), -- Finsbury park victoria line
  (1, 'Southbound', 'left', '940GZZLUACY', '9400ZZLUACY1'), -- Archway northern
  (3, 'Southbound', 'right', '940GZZLUEUS', '9400ZZLUEUS3'), -- Euston Northern
  (6, 'Southbound', 'right', '940GZZLUEUS', '9400ZZLUEUS6'), -- Euston Victoria
  (5, 'Westbound', 'right', '940GZZLUOXC', '9400ZZLUOXC5'), --Oxford circus central
  (2, 'Westbound', 'right', '940GZZLUEAN', '9400ZZLUEAN2') -- East Acton Central
  ;
INSERT INTO platform_line (platform_id, line_id) VALUES
  (1, 'circle'),
  (1, 'hammersmith-city'),
  (1, 'metropolitan'),
  (2, 'victoria'),
  (3, 'central'),
  (4, 'central'),
  (5, 'victoria'),
  (6, 'victoria'),
  (7, 'victoria'),
  (8, 'northern'),
  (9, 'northern'),
  (10, 'victoria'),
  (11, 'central'),
  (12, 'central');

INSERT INTO platform_exits (platform_id, carriage_from_front, door_from_front, type) VALUES
  (1, 7, 2, 2), -- kings x circ/hm/met west
  (4, 4, 2, 1), -- ox circ central east
  (6, 2, 1, 0), -- vic vic southu
  (7, 4, 4, 0), -- fins park vic north
  (9, 3, 1, 1), -- eus northern south
  (5, 6, 3, 1), -- ox circ vic south
  (12, 1, 1, 0)
  ;

INSERT INTO exit_interchanges (platform_exit_id, dest_platform_id) VALUES 
  (1, 2), -- kings x circle/hm/met west -> northern north
  (2, 5), -- oxf circ central east -> vic south
  (5, 10),
  (6, 11)
  ;

INSERT INTO sessions (sid) VALUES 
  ('MYFAKESESSIONID'),
  ('anotherfakesessionid');

-- INSERT INTO routes (name) VALUES
--   ('Finsbury park to Bermondsey via Greenpark'),
--   ('Whitechapel to Finsbury park via Kings cross');

INSERT INTO routes (data) VALUES
  ('{
      "0": {"startStationNaptan": "940GZZLUKSX"},
      "1": {"platformIndividualStopId": "9400ZZLUKSX1"},
      "2": {"lineId": "victoria"},
      "3": {"platformIndividualStopId": "9400ZZLUFPK3"},
      "4": {"endStationNaptan": "9400ZZLUFPK"}
  }'),
  ('{
      "0": {"startStationNaptan": "9400ZZLUFPK"},
      "1": {"platformIndividualStopId": "9400ZZLUFPK4"},
      "2": {"lineId": "victoria"},
      "3": {"platformIndividualStopId": "9400ZZLUKSX2"},
      "4": {"endStationNaptan": "940GZZLUKSX"}
  }'),
  ('{
      "0": {"startStationNaptan": "940GZZLUWTA"},
      "1": {"platformIndividualStopId": "9400ZZLUWTA1"},
      "2": {"lineId": "central"},
      "3": {"platformIndividualStopId": "9400ZZLUOXC1"},
      "4": {"stationNaptan": "940GZZLUOXC"},
      "5": {"platformIndividualStopId": "9400ZZLUOXC6"},
      "6": {"lineId": "victoria"},
      "7": {"platformIndividualStopId": "9400ZZLUVIC3"},
      "8": {"endStationNaptan": "940GZZLUVIC"}
  }');

INSERT INTO session_routes (sid, route_id) VALUES
  ('MYFAKESESSIONID', 1),
  ('anotherfakesessionid', 1),
  ('anotherfakesessionid', 2),
  ('anotherfakesessionid', 3);

COMMIT;