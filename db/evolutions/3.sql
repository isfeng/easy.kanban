# Kanban schema
 
# --- !Ups

ALTER TABLE textnote ADD COLUMN zindex integer;
ALTER TABLE drawnote ADD COLUMN zindex integer;
 
# --- !Downs
 
ALTER TABLE textnote DROP COLUMN IF EXISTS zindex;
ALTER TABLE drawnote DROP COLUMN IF EXISTS zindex;