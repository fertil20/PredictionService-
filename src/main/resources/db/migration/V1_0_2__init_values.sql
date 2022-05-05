







INSERT INTO users (username, name, email, password)
VALUES ('ralin', 'Перелыгин Дмитрий', 'kurralin@mail.ru', '$2b$10$QLXUPVP.ihTNij6tg/f0Kubfu2b8b4Ty9Ur0V1KnlgF1fE5iL7Gia');

INSERT INTO roles (name, privileges)
VALUES ('Пользователь', 'View'),
       ('Администратор', 'Manage_Users,Manage_Roles,View_Secret,Edit_Users,Manage_News,Edit_About,Booking');

INSERT INTO users_roles (user_id, role_name)
VALUES ('1', 'Пользователь'),
       ('1', 'Администратор');