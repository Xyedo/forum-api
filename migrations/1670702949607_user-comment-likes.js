/* eslint-disable camelcase */

exports.up = (pgm) => {
  pgm.sql(
    `CREATE table comment_like(
      id VARCHAR(50) PRIMARY KEY,
      comment_id VARCHAR(50) NOT NULL REFERENCES comment(id) ON DELETE CASCADE,
      user_id VARCHAR(50) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      likes BOOLEAN NOT NULL DEFAULT FALSE
    )`
  );
};

exports.down = (pgm) => {
  pgm.dropTable("comment_like");
};
