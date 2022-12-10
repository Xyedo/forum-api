/* eslint-disable camelcase */

exports.up = (pgm) => {
  pgm.sql(
    `CREATE TABLE comment (
      id VARCHAR(50) PRIMARY KEY,
      thread_id VARCHAR(50) NOT NULL REFERENCES thread(id) ON DELETE CASCADE,
      user_id VARCHAR(50) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      content TEXT NOT NULL,
      date TIMESTAMPTZ NOT NULL,
      is_delete BOOLEAN NOT NULL DEFAULT FALSE
    )`
  );
};

exports.down = (pgm) => {
  pgm.dropTable("comment");
};
