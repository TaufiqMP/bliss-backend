exports.up = (pgm) => {
  pgm.createTable("authentications", {
    id: {
      type: "serial",
      primaryKey: true,
    },
    user_id: {
      type: "varchar(20)",
      notNull: true,
      references: "users(user_id)",
      onDelete: "cascade",
    },
    refresh_token: {
      type: "text",
      notNull: true,
    },
    created_at: {
      type: "timestamp",
      notNull: true,
      default: pgm.func("current_timestamp"),
    },
  });

  pgm.createIndex("authentications", "user_id");
  pgm.createIndex("authentications", "refresh_token");
};

exports.down = (pgm) => {
  pgm.dropTable("authentications");
};
