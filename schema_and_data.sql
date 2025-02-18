DROP TABLE IF EXISTS workspace.default.audit;

CREATE TABLE workspace.default.audit (
    user string,
    time timestamp,
    action string,
    selected_ids string
);

DROP TABLE IF EXISTS workspace.default.ecr_excluded_ids;

CREATE TABLE workspace.default.ecr_excluded_ids (
    E2_Occurrence_ID string
);

DROP TABLE IF EXISTS workspace.default.ecr_key_stats;

CREATE TABLE workspace.default.ecr_key_stats (
  Comments STRING,
  E2_Occurrence_ID STRING,
  File_number STRING,
  UTC_date DATE,
  Local_date DATE,
  State_area_of_occ STRING,
  Location STRING,
  Occurrence_class STRING,
  Injury_Level STRING,
  Highest_damage STRING,
  Occurrence_Category STRING,
  Aircraft_Registration STRING,
  State_of_Registery STRING,
  Operator_State STRING,
  Operation_type_Level_1 STRING,
  Operation_type_Level_2 STRING,
  Operation_type_Level_3 STRING,
  Operator_Name STRING,
  Aircraft_category_Level_1 STRING,
  Aircraft_category_Level_2 STRING,
  Aircraft_category_Level_3 STRING,
  Aircraft_category_Level_4 STRING,
  Manufacturer_model_Level_1 STRING,
  Manufacturer_model_Level_2 STRING,
  Annex_I_Aircraft STRING,
  Mass_group_L1 STRING,
  Mass_Group_L2 STRING,
  Propulsion_Type STRING,
  Flight_phase STRING,
  Total_Number_of_Fatalities_Aircraft BIGINT,
  Total_Number_of_Serious_Injuries_Aircraft BIGINT,
  Total_Number_of_Fatalities_Ground BIGINT,
  Total_Number_of_Serious_Injuries_Ground BIGINT,
  Headline STRING,
  Consolidated_date DATE,
  Year BIGINT,
  Consolidated_Occurrence_Class STRING,
  CS_27_CS_29 STRING,
  Annex_I_rotorcraft STRING,
  Foreign_operator_aircraft STRING,
  Rotorcraft_Safety_Roadmap_SPI STRING
);

INSERT INTO workspace.default.ecr_key_stats VALUES 
('Incident report 1', 'OC-803557544', 'FN-658107', DATE('2022-09-28'), DATE('2022-09-28'), 'Italy', 'Location 1', 'Incident', 'Serious Injuries', 'Destroyed', 'FUEL: Fuel related', 'Reg-6117', 'Italy', 'Spain', 'Medical', 'Police', 'Commercial', 'Operator 1', 'Rotary Wing', 'Helicopter', 'Single Engine', 'Category 4', 'Cessna', 'C172', 'No', '27 001 kg and above', '2 251 - 5 700 kg', 'Turboshaft', 'Taxiing', 2, 1, 2, 1, 'Loss of control on landing', DATE('2022-09-28'), 2022, 'Incident', 'CS 29', 'No', 'No', 'SPI Data'),
('Incident report 2', 'OC-923864890', 'FN-552732', DATE('2020-02-03'), DATE('2020-02-03'), 'Italy', 'Location 2', 'Serious Incident', 'Minor Injuries', 'Minor', 'FUEL: Fuel related', 'Reg-6893', 'USA', 'USA', 'Police', 'Police', 'Police', 'Operator 2', 'Fixed Wing', 'Helicopter', 'Multi Engine', 'Category 4', 'Bell', 'C172', 'No', '27 001 kg and above', '0 - 2 250 kg', 'Turboprop', 'En route', 4, 3, 2, 0, 'Birdstrike incident', DATE('2020-02-03'), 2020, 'Serious Incident', 'CS 29', 'No', 'Yes', 'SPI Data'),
('Incident report 3', 'OC-219545724', 'FN-469383', DATE('2017-04-16'), DATE('2017-04-16'), 'Spain', 'Location 3', 'Accident', 'Fatal', 'Destroyed', 'BIRD: Birdstrike', 'Reg-5553', 'Italy', 'France', 'Commercial', 'Commercial', 'Police', 'Operator 3', 'Rotary Wing', 'Helicopter', 'Multi Engine', 'Category 4', 'Cessna', 'S76', 'No', '0 - 2 250 kg', '27 001 kg and above', 'Piston', 'Takeoff', 5, 0, 0, 0, 'Engine failure mid-flight', DATE('2017-04-16'), 2017, 'Serious Incident', 'CS 27', 'No', 'Yes', 'SPI Data'),
('Incident report 4', 'OC-569544347', 'FN-327937', DATE('2015-01-10'), DATE('2015-01-10'), 'Spain', 'Location 4', 'Incident', 'None', 'Destroyed', 'FUEL: Fuel related', 'Reg-1728', 'USA', 'Italy', 'Military', 'Police', 'Police', 'Operator 4', 'Rotary Wing', 'Helicopter', 'Multi Engine', 'Category 4', 'Airbus', 'B206', 'No', '27 001 kg and above', '27 001 kg and above', 'Turboprop', 'Taxiing', 4, 3, 3, 2, 'Aircraft encountered turbulence', DATE('2015-01-10'), 2015, 'Accident', 'CS 29', 'No', 'No', 'SPI Data'),
('Incident report 5', 'OC-977815583', 'FN-461572', DATE('2020-11-30'), DATE('2020-11-30'), 'Italy', 'Location 5', 'Accident', 'Minor Injuries', 'Minor', 'TURB: Turbulence encounter', 'Reg-5331', 'USA', 'Germany', 'Medical', 'Commercial', 'Medical', 'Operator 5', 'Fixed Wing', 'Helicopter', 'Single Engine', 'Category 4', 'Bell', 'S76', 'No', '27 001 kg and above', '0 - 2 250 kg', 'Piston', 'Taxiing', 0, 0, 3, 1, 'Aircraft encountered turbulence', DATE('2020-11-30'), 2020, 'Serious Incident', 'CS 29', 'No', 'Yes', 'SPI Data'),
('Incident report 50', 'OC-493249425', 'FN-522087', DATE('2017-08-31'), DATE('2017-08-31'), 'Spain', 'Location 50', 'Accident', 'Serious Injuries', 'Substantial', 'TURB: Turbulence encounter', 'Reg-4726', 'Canada', 'Canada', 'Private', 'Private', 'Military', 'Operator 50', 'Rotary Wing', 'Airplane', 'Single Engine', 'Category 4', 'Airbus', 'A320', 'No', '27 001 kg and above', '5 701 - 27 000 kg', 'Turboprop', 'Cruise', 5, 0, 0, 3, 'Loss of control on landing', DATE('2017-08-31'), 2017, 'Incident', 'CS 29', 'No', 'Yes', 'SPI Data'),
('Incident report 51', 'OC-948551717', 'FN-368020', DATE('2020-02-20'), DATE('2020-02-20'), 'Spain', 'Location 51', 'Accident', 'Fatal', 'Minor', 'FUEL: Fuel related', 'Reg-6457', 'France', 'Germany', 'Police', 'Commercial', 'Police', 'Operator 51', 'Fixed Wing', 'Airplane', 'Multi Engine', 'Category 4', 'Bell', '737', 'No', '2 251 - 5 700 kg', '27 001 kg and above', 'Turbofan', 'Takeoff', 5, 1, 1, 1, 'Birdstrike incident', DATE('2020-02-20'), 2020, 'Incident', 'CS 27', 'No', 'No', 'SPI Data'),
('Incident report 52', 'OC-125259675', 'FN-143142', DATE('2017-09-09'), DATE('2017-09-09'), 'Spain', 'Location 52', 'Accident', 'None', 'None', 'LOC-I: Loss of control - inflight', 'Reg-4423', 'USA', 'UK', 'Private', 'Private', 'Medical', 'Operator 52', 'Fixed Wing', 'Airplane', 'Multi Engine', 'Category 4', 'Airbus', 'A320', 'No', '2 251 - 5 700 kg', '2 251 - 5 700 kg', 'Turboshaft', 'Taxiing', 3, 2, 0, 0, 'Loss of control on landing', DATE('2017-09-09'), 2017, 'Serious Incident', 'CS 27', 'No', 'Yes', 'SPI Data'),
('Incident report 53', 'OC-361747170', 'FN-158966', DATE('2023-05-20'), DATE('2023-05-20'), 'USA', 'Location 53', 'Incident', 'Serious Injuries', 'None', 'BIRD: Birdstrike', 'Reg-1856', 'Spain', 'Australia', 'Police', 'Police', 'Private', 'Operator 53', 'Fixed Wing', 'Airplane', 'Single Engine', 'Category 4', 'Sikorsky', 'B206', 'No', '0 - 2 250 kg', '0 - 2 250 kg', 'Piston', 'En route', 0, 4, 2, 0, 'Loss of control on landing', DATE('2023-05-20'), 2023, 'Incident', 'CS 27', 'No', 'No', 'SPI Data'),
('Incident report 54', 'OC-642197573', 'FN-198575', DATE('2015-07-01'), DATE('2015-07-01'), 'Germany', 'Location 54', 'Serious Incident', 'Fatal', 'Minor', 'LOC-I: Loss of control - inflight', 'Reg-5090', 'USA', 'Italy', 'Military', 'Military', 'Commercial', 'Operator 54', 'Rotary Wing', 'Airplane', 'Multi Engine', 'Category 4', 'Boeing', 'B206', 'No', '5 701 - 27 000 kg', '5 701 - 27 000 kg', 'Turbofan', 'Cruise', 2, 1, 1, 2, 'Aircraft encountered turbulence', DATE('2015-07-01'), 2015, 'Serious Incident', 'CS 29', 'No', 'No', 'SPI Data'),
('Incident report 55', 'OC-892902266', 'FN-539750', DATE('2020-03-10'), DATE('2020-03-10'), 'Spain', 'Location 55', 'Serious Incident', 'None', 'Minor', 'LOC-I: Loss of control - inflight', 'Reg-2977', 'Australia', 'Canada', 'Military', 'Military', 'Commercial', 'Operator 55', 'Rotary Wing', 'Helicopter', 'Multi Engine', 'Category 4', 'Cessna', 'S76', 'No', '5 701 - 27 000 kg', '2 251 - 5 700 kg', 'Piston', 'En route', 1, 0, 1, 3, 'Engine failure mid-flight', DATE('2020-03-10'), 2020, 'Incident', 'CS 27', 'No', 'No', 'SPI Data'),
('Incident report 56', 'OC-919754244', 'FN-530344', DATE('2019-11-29'), DATE('2019-11-29'), 'Spain', 'Location 56', 'Accident', 'Minor Injuries', 'None', 'FUEL: Fuel related', 'Reg-3878', 'USA', 'Germany', 'Police', 'Military', 'Medical', 'Operator 56', 'Fixed Wing', 'Helicopter', 'Single Engine', 'Category 4', 'Sikorsky', 'B206', 'No', '5 701 - 27 000 kg', '0 - 2 250 kg', 'Turbofan', 'En route', 4, 0, 2, 3, 'Loss of control on landing', DATE('2019-11-29'), 2019, 'Accident', 'CS 27', 'No', 'Yes', 'SPI Data'),
('Incident report 57', 'OC-500477650', 'FN-540448', DATE('2019-01-31'), DATE('2019-01-31'), 'Germany', 'Location 57', 'Serious Incident', 'Minor Injuries', 'Minor', 'FUEL: Fuel related', 'Reg-6402', 'Canada', 'Spain', 'Commercial', 'Medical', 'Medical', 'Operator 57', 'Fixed Wing', 'Helicopter', 'Multi Engine', 'Category 4', 'Boeing', '737', 'No', '2 251 - 5 700 kg', '0 - 2 250 kg', 'Turbofan', 'Landing', 0, 2, 2, 2, 'Aircraft encountered turbulence', DATE('2019-01-31'), 2019, 'Accident', 'CS 29', 'No', 'Yes', 'SPI Data'),
('Incident report 58', 'OC-425534654', 'FN-538502', DATE('2019-06-22'), DATE('2019-06-22'), 'Canada', 'Location 58', 'Incident', 'Minor Injuries', 'Destroyed', 'FUEL: Fuel related', 'Reg-2814', 'UK', 'UK', 'Military', 'Private', 'Private', 'Operator 58', 'Fixed Wing', 'Airplane', 'Single Engine', 'Category 4', 'Boeing', 'A320', 'No', '0 - 2 250 kg', '0 - 2 250 kg', 'Turboprop', 'Taxiing', 2, 1, 0, 2, 'Loss of control on landing', DATE('2019-06-22'), 2019, 'Incident', 'CS 29', 'No', 'No', 'SPI Data'),
('Incident report 59', 'OC-716136673', 'FN-649678', DATE('2015-01-04'), DATE('2015-01-04'), 'Spain', 'Location 59', 'Incident', 'Minor Injuries', 'Minor', 'BIRD: Birdstrike', 'Reg-9424', 'UK', 'Germany', 'Medical', 'Police', 'Medical', 'Operator 59', 'Rotary Wing', 'Airplane', 'Multi Engine', 'Category 4', 'Bell', 'S76', 'No', '5 701 - 27 000 kg', '2 251 - 5 700 kg', 'Turboshaft', 'Cruise', 0, 5, 3, 1, 'Aircraft encountered turbulence', DATE('2015-01-04'), 2015, 'Accident', 'CS 27', 'No', 'Yes', 'SPI Data'),
('Incident report 60', 'OC-702729088', 'FN-518465', DATE('2017-01-12'), DATE('2017-01-12'), 'Australia', 'Location 60', 'Serious Incident', 'Minor Injuries', 'Destroyed', 'TURB: Turbulence encounter', 'Reg-7041', 'Australia', 'Australia', 'Military', 'Medical', 'Commercial', 'Operator 60', 'Fixed Wing', 'Helicopter', 'Single Engine', 'Category 4', 'Airbus', 'B206', 'No', '2 251 - 5 700 kg', '0 - 2 250 kg', 'Piston', 'Taxiing', 0, 3, 1, 2, 'Birdstrike incident', DATE('2017-01-12'), 2017, 'Serious Incident', 'CS 29', 'No', 'Yes', 'SPI Data'),
('Incident report 61', 'OC-812361171', 'FN-834189', DATE('2016-12-28'), DATE('2016-12-28'), 'Germany', 'Location 61', 'Serious Incident', 'None', 'None', 'BIRD: Birdstrike', 'Reg-9994', 'Italy', 'Canada', 'Military', 'Medical', 'Military', 'Operator 61', 'Fixed Wing', 'Airplane', 'Single Engine', 'Category 4', 'Cessna', '737', 'No', '5 701 - 27 000 kg', '27 001 kg and above', 'Turboshaft', 'En route', 2, 4, 3, 0, 'Loss of control on landing', DATE('2016-12-28'), 2016, 'Incident', 'CS 29', 'No', 'No', 'SPI Data'),
('Incident report 62', 'OC-645128384', 'FN-653578', DATE('2014-08-15'), DATE('2014-08-15'), 'UK', 'Location 62', 'Incident', 'Serious Injuries', 'Destroyed', 'LOC-I: Loss of control - inflight', 'Reg-3842', 'Italy', 'Canada', 'Police', 'Police', 'Police', 'Operator 62', 'Fixed Wing', 'Helicopter', 'Single Engine', 'Category 4', 'Bell', 'S76', 'No', '27 001 kg and above', '5 701 - 27 000 kg', 'Turboshaft', 'Cruise', 0, 2, 0, 3, 'Engine failure mid-flight', DATE('2014-08-15'), 2014, 'Accident', 'CS 29', 'No', 'Yes', 'SPI Data');