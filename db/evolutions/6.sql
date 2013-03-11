# Kanban schema
 
# --- !Ups

CREATE TABLE videonote
(
  id bigint NOT NULL,
  created_at timestamp without time zone,
  updated_at timestamp without time zone,
  color character varying(255),
  height integer NOT NULL,
  width integer NOT NULL,
  x integer NOT NULL,
  y integer NOT NULL,
  zindex integer NOT NULL,
  videoid character varying(255),
  kanban_id bigint,
  value_id bigint,
  CONSTRAINT videonote_pkey PRIMARY KEY (id ),
  CONSTRAINT fkc6e2a2ed68a98e7e FOREIGN KEY (kanban_id)
      REFERENCES kanban (id) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE NO ACTION,
  CONSTRAINT fkc6e2a2edc71b4d56 FOREIGN KEY (value_id)
      REFERENCES valuestream (id) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE NO ACTION
);
 
# --- !Downs
 
DROP TABLE IF EXISTS videonote;

