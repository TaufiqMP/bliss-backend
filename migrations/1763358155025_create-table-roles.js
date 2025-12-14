exports.up = (pgm) => {
  pgm.createTable("role", {
    role_id: {
      type: "serial",
      primaryKey: true
    },
    role_name: {
      type: "varchar(50)",
      notNull: true,
      unique: true
    }
  });

  // Insert default roles
  pgm.sql(`
    INSERT INTO role (role_name) 
    VALUES ('admin'), ('sales');
  `);
};

exports.down = (pgm) => {
  pgm.dropTable("role");
};
