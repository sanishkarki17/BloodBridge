const bcrypt = require('bcryptjs');
const db = require('./db');

async function updateAdminPassword() {
    try {
        const newPassword = 'Sanish12#';
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        const [result] = await db.query(
            "UPDATE users SET password = ? WHERE email = 'admin@bloodbridge.com'",
            [hashedPassword]
        );

        if (result.affectedRows > 0) {
            console.log('✅ Admin password updated successfully!');
            console.log('Email: admin@bloodbridge.com');
            console.log('New Password: Sanish12#');
        } else {
            console.log('❌ Admin user not found. Creating admin user...');

            await db.query(
                "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
                ['Admin', 'admin@bloodbridge.com', hashedPassword, 'admin']
            );

            console.log('✅ Admin user created successfully!');
            console.log('Email: admin@bloodbridge.com');
            console.log('Password: Sanish12#');
        }

        process.exit(0);
    } catch (err) {
        console.error('Error updating password:', err);
        process.exit(1);
    }
}

updateAdminPassword();
