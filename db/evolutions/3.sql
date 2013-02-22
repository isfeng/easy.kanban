# Kanban schema
 
# --- !Ups

ALTER TABLE textnote ADD COLUMN zindex integer DEFAULT 0;
ALTER TABLE drawnote ADD COLUMN zindex integer DEFAULT 0;
 
# --- !Downs
 
ALTER TABLE textnote DROP COLUMN IF EXISTS zindex;
ALTER TABLE drawnote DROP COLUMN IF EXISTS zindex;