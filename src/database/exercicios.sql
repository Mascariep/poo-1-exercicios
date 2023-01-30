-- Active: 1675096052263@@127.0.0.1@3306

----------CRIAR AS TABELAS
CREATE TABLE videos (
    id TEXT PRIMARY KEY UNIQUE NOT NULL,
    title TEXT NOT NULL,
    duration TEXT UNIQUE NOT NULL,
    upload_at TEXT DEFAULT(DATETIME('now', 'localtime')) NOT NULL
);

----------POPULAR AS TABELAS
INSERT INTO videos (id, title, duration)
VALUES
	("v001", "Slipknot", "05:30"),
	("v002", "Korn", "04:50");

----------VISUALIZAR AS TABELAS
SELECT * FROM videos;

---------DELETAR AS TABELAS
DROP TABLE videos;

----------------------------------------
