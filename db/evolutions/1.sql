# Kanban schema
 
# --- !Ups

ALTER TABLE Kanban ADD COLUMN _public boolean;
 
# --- !Downs
 
ALTER TABLE Kanban DROP COLUMN IF EXISTS _public ;