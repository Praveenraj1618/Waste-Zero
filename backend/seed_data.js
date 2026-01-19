const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Message = require('./models/Message');
const Notification = require('./models/Notification');

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/wastezero';

async function seed() {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('Connected to MongoDB...');

        // 1. Find or Create Main Test User
        let testUser = await User.findOne({ email: 'test@example.com' });
        if (!testUser) {
            console.log('Creating test user...');
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash('password123', salt);
            testUser = await User.create({
                name: 'Test User',
                email: 'test@example.com',
                password: hashedPassword,
                role: 'volunteer',
                location: 'San Francisco, CA',
                bio: 'Passionate about recycling!'
            });
        }
        console.log('Test User ID:', testUser._id);

        // 2. Create Partner Users
        const partners = [
            { name: 'Green Earth NGO', email: 'ngo@example.com', role: 'ngo', bio: 'Saving the planet one step at a time.' },
            { name: 'Alice Volunteer', email: 'alice@example.com', role: 'volunteer', bio: 'Community organizer.' },
            { name: 'Bob Pickup', email: 'bob@example.com', role: 'pickup_agent', bio: 'Fast and reliable pickups.' }
        ];

        const partnerDocs = [];
        for (const p of partners) {
            let user = await User.findOne({ email: p.email });
            if (!user) {
                const salt = await bcrypt.genSalt(10);
                const hashedPassword = await bcrypt.hash('password123', salt);
                user = await User.create({ ...p, password: hashedPassword });
                console.log(`Created partner: ${p.name}`);
            }
            partnerDocs.push(user);
        }

        // 3. Create Messages
        console.log('Seeding messages...');
        await Message.deleteMany({ $or: [{ sender_id: testUser._id }, { receiver_id: testUser._id }] }); // Clear old messages for test user

        const messages = [
            // Chat with NGO
            { sender_id: partnerDocs[0]._id, receiver_id: testUser._id, content: 'Hi! Thanks for joining our cleanup drive.', read: true },
            { sender_id: testUser._id, receiver_id: partnerDocs[0]._id, content: 'Happy to help! When is the next one?', read: true },
            { sender_id: partnerDocs[0]._id, receiver_id: testUser._id, content: 'Next Saturday at 9 AM. See you there!', read: false },

            // Chat with Alice
            { sender_id: testUser._id, receiver_id: partnerDocs[1]._id, content: 'Hey Alice, do you have extra recycling bags?', read: true },
            { sender_id: partnerDocs[1]._id, receiver_id: testUser._id, content: 'Yes, I can drop some off tomorrow.', read: false },
        ];

        await Message.insertMany(messages);

        // 4. Create Notifications
        console.log('Seeding notifications...');
        await Notification.deleteMany({ user_id: testUser._id }); // Clear old notifications

        const notifications = [
            {
                user_id: testUser._id,
                type: 'match',
                message: 'You matched with a new volunteering opportunity: Beach Cleanup!',
                read: false
            },
            {
                user_id: testUser._id,
                type: 'pickup',
                message: 'Your pickup request #123 has been scheduled for tomorrow.',
                read: true
            },
            {
                user_id: testUser._id,
                type: 'message',
                message: 'New message from Green Earth NGO',
                read: false
            },
            {
                user_id: testUser._id,
                type: 'application',
                message: 'Your application for "Park Restoration" was approved!',
                read: false
            }
        ];

        await Notification.insertMany(notifications);

        console.log('✅ Database seeded successfully!');
        process.exit();
    } catch (err) {
        console.error('Seeding error:', err);
        process.exit(1);
    }
}

seed();
