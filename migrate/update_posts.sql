alter table posts
add column deletedAt Datetime;

alter table comments
add column deletedAt Datetime;

alter table replies_comment
add column deletedAt Datetime;

alter table reactions 
add column reply_id integer null

alter table reactions 
add constraint fk_reply_id foreign key(reply_id) references replies_comment(id)