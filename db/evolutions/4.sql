# Kanban schema
 
# --- !Ups

ALTER TABLE textnote ADD COLUMN width integer DEFAULT 0;
ALTER TABLE textnote ADD COLUMN height integer DEFAULT 0;
ALTER TABLE drawnote ADD COLUMN width integer DEFAULT 0;
ALTER TABLE drawnote ADD COLUMN height integer DEFAULT 0;
 
# --- !Downs
 
ALTER TABLE textnote DROP COLUMN IF EXISTS width;
ALTER TABLE textnote DROP COLUMN IF EXISTS height;
ALTER TABLE drawnote DROP COLUMN IF EXISTS width;
ALTER TABLE drawnote DROP COLUMN IF EXISTS height;