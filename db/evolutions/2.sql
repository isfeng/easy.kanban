# Kanban schema
 
# --- !Ups

ALTER TABLE drawnote ADD COLUMN url varchar(255);
 
# --- !Downs
 
ALTER TABLE drawnote DROP COLUMN IF EXISTS url;