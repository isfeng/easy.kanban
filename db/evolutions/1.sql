# Kanban schema
 
# --- !Ups

ALTER TABLE Kanban (
    ADD COLUMN _public boolean NOT NULL
);
 
# --- !Downs
 
ALTER TABLE Kanban DROP COLUMN IF EXISTS _public ;