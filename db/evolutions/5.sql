# Kanban schema
 
# --- !Ups

ALTER TABLE kanban ADD COLUMN access integer DEFAULT 0;
 
# --- !Downs
 
ALTER TABLE kanban DROP COLUMN IF EXISTS access;