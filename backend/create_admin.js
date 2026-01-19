const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/wastezero';

async function createAdmin() {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('Connected to MongoDB...');

        const email = 'admin@wastezero.com';
        const password = 'admin123';

        let admin = await User.findOne({ email });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        if (admin) {
            console.log('Updating existing admin user...');
            admin.password = hashedPassword;
            admin.role = 'admin';
            admin.name = 'System Admin';
            await admin.save();
        } else {
            console.log('Creating new admin user...');
            admin = await User.create({
                name: 'System Admin',
                email,
                password: hashedPassword,
                role: 'admin',
                location: 'HQ',
                bio: 'System Administrator'
            });
        }

        console.log('✅ Admin user ready!');
        console.log(`Email: ${email}`);
        console.log(`Password: ${password}`);

        process.exit();
    } catch (err) {
        console.error('Error:', err);
        process.exit(1);
    }
}

createAdmin();
