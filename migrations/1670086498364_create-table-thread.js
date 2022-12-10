/* eslint-disable camelcase */

exports.up = (pgm) => {
  pgm.createTable("thread", {
    id: {
      type: "VARCHAR(50)",
      primaryKey: true,
    },
    title: {
      type: "VARCHAR(128)",
      notNull: true,
    },
    body: {
      type: "TEXT",
      notNull: true,
    },
    user_id: {
      type: "VARCHAR(50)",
      notNull: true,
      references: "users(id)",
      onDelete: "CASCADE",
    },
    date: {
      type: "TIMESTAMPTZ",
      notNull: true,
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable("thread");
};
