exports.up = (pgm) => {
  pgm.createType('status_user', ['AKTIF', 'CUTI', 'RESIGN']);

  pgm.createTable("users", {
    user_id: {
      type: "varchar(20)",
      primaryKey: true,
    },
    username: {
      type: "varchar(100)",
      notNull: true
    },
    phone_number: {
      type: "varchar(20)",
      notNull: true,
      default: 'Belum Mengisi'
    },
    status: {
      type: "status_user",
      notNull: true,
      default: 'AKTIF'
    },
    address: {
      type: "text",
      notNull: true,
      default: 'Belum Mengisi'
    },
    email: {
      type: "varchar(100)",
      notNull: true,
      unique: true
    },
    password: {
      type: "text",
      notNull: true
    },
    role_id: {
      type: "integer",
      notNull: true,
      references: "role(role_id)",
      onDelete: "SET NULL"
    }
  });
};

exports.down = (pgm) => {
  pgm.dropTable("users");
  pgm.dropType('status_user');
};
