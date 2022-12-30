drop view IF EXISTS project_infos;
create table IF NOT EXISTS projects_dg_tmp
(
  id               integer not null
    constraint id_projects
      primary key autoincrement,
  name             TEXT,
  start_date       TEXT    not null,
  nominative_value integer default 0,
  end_date         TEXT
);
insert into projects_dg_tmp(id, name, start_date, nominative_value)
select id, name, date, nominative_value
from projects;
drop table IF EXISTS projects;
alter table projects_dg_tmp
  rename to projects;
alter table movements
  add "order" integer not null;
CREATE VIEW IF NOT EXISTS project_infos as
select p.*, COALESCE(SUM(m.value), 0) as current_value
from projects p
       left join movements m on m.id_project = p.id
group by p.id;
