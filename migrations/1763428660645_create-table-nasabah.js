exports.up = (pgm) => {
    pgm.createType('nasabah_status', ['OPEN', 'CLOSED REJECTED', 'CLOSED APPROVED']);

    pgm.createTable('nasabah', {
        id: {
            type: 'SERIAL',
            primaryKey: true,
            notNull: true,
        },
        assigned_to: {
            type: 'varchar(20)',
            notNull: true,
            references: 'users(user_id)',
            onDelete: 'CASCADE',
        },
        first_name: {
            type: 'VARCHAR(50)',
            notNull: true,
        },
        last_name: {
            type: 'VARCHAR(50)',
            notNull: true,
        },
        phone_number: {
            type: 'VARCHAR(20)',
            notNull: true,
        },
        email: {
            type: 'VARCHAR(100)',
            notNull: true,
        },
        age: {
            type: 'INTEGER',
            notNull: true,
        },
        job: {
            type: 'VARCHAR(50)',
        },
        marital: {
            type: 'VARCHAR(50)',
        },
        education: {
            type: 'VARCHAR(50)',
        },
        balance: {
            type: 'INTEGER',
            notNull: true,
        },
        housing: {
            type: 'BOOLEAN',
        },
        loan: {
            type: 'BOOLEAN',
        },
        status: {
            type: 'nasabah_status',
            notNull: true,
            default: 'OPEN',
        },
        prediction_score: {
            type: 'REAL',
        }
    });

    pgm.createIndex('nasabah', 'assigned_to');
};

exports.down = (pgm) => {
    pgm.dropTable('nasabah');
    pgm.dropType('nasabah_status');
};