-- put your schema here

DROP TABLE IF EXISTS Numbers;
DROP TABLE IF EXISTS Messages;

CREATE TABLE Numbers (
    id      INTEGER PRIMARY KEY AUTOINCREMENT,
    num     TEXT NOT NULL,
    name    TEXT,
    UNIQUE(num)
);

CREATE TABLE Messages (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    content     TEXT NOT NULL,
    time        INTEGER NOT NULL,
    num_to      TEXT NOT NULL,
    num_id      INTEGER NOT NULL,
    FOREIGN KEY (num_id) REFERENCES Numbers(id)
        ON DELETE CASCADE ON UPDATE NO ACTION
);
