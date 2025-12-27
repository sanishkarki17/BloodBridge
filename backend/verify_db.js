const pool = require('./db');

(async () => {
    try {
        const connection = await pool.getConnection();
        console.log('Successfully connected to database!');
        connection.release();
        process.exit(0);
    } catch (error) {
        console.error('Database connection failed:', error.message);
        process.exit(1);
    }
})();
