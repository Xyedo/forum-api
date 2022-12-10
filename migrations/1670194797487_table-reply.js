/* eslint-disable camelcase */

exports.up = (pgm) => {
  pgm.sql(
    `CREATE TABLE reply (
      id VARCHAR(50) PRIMARY KEY,
      comment_id VARCHAR(50) NOT NULL REFERENCES comment(id) ON DELETE CASCADE,
      user_id VARCHAR(50) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      content TEXT NOT NULL,
      date TIMESTAMPTZ NOT NULL,
      is_delete BOOLEAN NOT NULL DEFAULT FALSE
    )`
  );
};

exports.down = (pgm) => {
  pgm.dropTable("reply");
};
