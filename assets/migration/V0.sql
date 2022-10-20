drop view IF EXISTS project_infos;
alter table projects add nominative_value integer default 0;
CREATE TABLE if not exists movements
(
  id          INTEGER not null
    constraint id_key
      primary key autoincrement,
  value       REAL,
  date        TEXT,
  id_project  INTEGER
    constraint movements___groups_fk
      references projects,
  id_type     INTEGER
    constraint movements_types___fk
      references types,
  description TEXT
);
create table IF NOT EXISTS movements_dg_tmp
(
  id          INTEGER not null
    constraint id_key
      primary key autoincrement,
  value       REAL,
  date        TEXT,
  id_project  INTEGER,
  id_type     INTEGER,
  description TEXT
);
insert into movements_dg_tmp(id, value, date, id_project, id_type, description)
select id, value, date, id_project, id_type, description
from movements;
drop table IF EXISTS movements;
alter table movements_dg_tmp
  rename to movements;
CREATE VIEW IF NOT EXISTS project_infos as
select p.*, COALESCE(SUM(m.value), 0) as current_value
from projects p
       left join movements m on m.id_project = p.id
group by p.id;
