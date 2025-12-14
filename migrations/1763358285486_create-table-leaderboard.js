exports.up = (pgm) => {
  pgm.createTable("leaderboard", {
    leaderboard_id: {
      type: "varchar(20)",
      primaryKey: true,
    },
    user_id: {
      type: "varchar(20)",
      notNull: true,
      references: "users(user_id)",
      onDelete: "cascade",
    },
    score: {
      type: "integer",
      notNull: true,
      default: 0,
    },
    updated_at: {
      type: "timestamp",
      notNull: true,
      default: pgm.func("current_timestamp"),
    },
  });

  pgm.createIndex("leaderboard", "score");
  pgm.createIndex("leaderboard", "user_id");
};

exports.down = (pgm) => {
  pgm.dropTable("leaderboard");
};
