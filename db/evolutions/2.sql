# Kanban schema
 
# --- !Ups

ALTER TABLE Kanban ADD COLUMN url varchar(255);
 
# --- !Downs
 
ALTER TABLE Kanban DROP COLUMN IF EXISTS url;