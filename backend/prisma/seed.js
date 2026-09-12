const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
    console.log('Seeding database...\n');

    // ─── Admin ──────────────────────────────────────
    const hashedPassword = await bcrypt.hash('admin123', 12);
    await prisma.admin.upsert({
        where: { username: 'admin' },
        update: { password: hashedPassword },
        create: { username: 'admin', password: hashedPassword }
    });
    console.log('Admin: admin / admin123');

    // ─── Profile ────────────────────────────────────
    const profile = await prisma.profile.upsert({
        where: { id: 'profile-main' },
        update: {},
        create: {
            id: 'profile-main',
            firstName: 'حامد',
            lastName: 'عرباسی',
            title: 'Hair Artist',
            shortBio: 'امیر عرباسی با بیش از 10 سال تجربه',
            bio: 'امیر عرباسی با بیش از 10 سال تجربه در زمینه مو و برنامه‌ریزی در سالون مو جایگذار شده است.\n\nتجربه من اصلی ترین تهران به درخدمت کوتاهی مو، رنگ مو، فید تخصصی، صافی و احیا، شینیون و بافت مو باشد.\n\nاستفاده از جدیدترین تنظیمات بین المللی و تجربه از مراکز برتر در صنعت مو ارائه گرفته است.',
            phone: '09121234567',
            email: 'hamid.studio@gmail.com',
            address: 'تهران، بلوار اصلی شمالی 100، نharct منفرعی',
            googleMapsUrl: 'https://maps.google.com/?q=35.6892,51.3890',
            avatar: '',
            heroImage: '',
            workingHoursNote: 'شنبه تا پنجشنبه: 10:00 الی 20:00\nجمعه: بسته\nپنجشنبه: 13:00 الی 14:00',
        }
    });
    console.log('Profile created');

    // ─── Social Links ───────────────────────────────
    const socialLinks = [
        { id: 'sl-ig', platform: 'instagram', url: 'https://instagram.com/hamid_hair_studio', label: '@hamid_hair_studio', sortOrder: 0, profileId: profile.id },
        { id: 'sl-wa', platform: 'whatsapp', url: 'https://wa.me/989121234567', label: '+98 912 123 4567', sortOrder: 1, profileId: profile.id },
        { id: 'sl-tg', platform: 'telegram', url: 'https://t.me/hamid_hair_studio', label: '@hamid_hair_studio', sortOrder: 2, profileId: profile.id },
        { id: 'sl-ph', platform: 'phone', url: 'tel:+989121234567', label: '09121234567', sortOrder: 3, profileId: profile.id },
    ];
    for (const sl of socialLinks) {
        await prisma.socialLink.upsert({ where: { id: sl.id }, update: {}, create: sl });
    }
    console.log(socialLinks.length + ' social links');

    // ─── Categories ─────────────────────────────────
    const catMen = await prisma.category.upsert({
        where: { id: 'cat-men' }, update: {},
        create: { id: 'cat-men', name: 'مردانه', gender: 'male', sortOrder: 0 }
    });
    const catWomen = await prisma.category.upsert({
        where: { id: 'cat-women' }, update: {},
        create: { id: 'cat-women', name: 'زنانه', gender: 'female', sortOrder: 1 }
    });
    console.log('2 categories');

    // ─── Services ───────────────────────────────────
    const servicesData = [
        { id: 'svc-1', title: 'کوتاهی کلاسیک', duration: 45, price: 350000, categoryId: 'cat-men', description: 'کوتاهی مو مردانه به سبک کلاسیک با استفاده از جدیدترین تنظیمات برتز', sortOrder: 0 },
        { id: 'svc-2', title: 'کوتاهی + فید تخصصی', duration: 60, price: 450000, categoryId: 'cat-men', description: 'کوتاهی با تکنیک فید و گرادیان حرفه‌ای برای اندازه استیل موردنظر', sortOrder: 1 },
        { id: 'svc-3', title: 'اصلاح ریش', duration: 30, price: 200000, categoryId: 'cat-men', description: 'اصلاح و فرم‌دهی ریش با تیغ اصلاح اصلی و موهر', sortOrder: 2 },
        { id: 'svc-4', title: 'رنگ مو مردانه', duration: 90, price: 600000, categoryId: 'cat-men', description: 'رنگ‌آمیزی حرفه‌ای مو با استفاده از رنگ‌های ارگانیک و اورجینال', sortOrder: 3 },
        { id: 'svc-5', title: 'کوتاهی و اصلاح کامل', duration: 75, price: 500000, categoryId: 'cat-men', description: 'بسته اصلاحی کامل شامل کوتاهی مو، اصلاح ریش و فرم‌دهی حرفه‌ای', sortOrder: 4 },
        { id: 'svc-6', title: 'کوتاهی زنانه', duration: 60, price: 500000, categoryId: 'cat-women', description: 'کوتاهی و فرم‌دهی مو، با استفاده از تنظیمات برتر برای موهای نازک و برتن', sortOrder: 0 },
        { id: 'svc-7', title: 'رنگ و مش', duration: 150, price: 1200000, categoryId: 'cat-women', description: 'رنگ‌آمیزی تخصصی و هایلایت با استفاده از رنگ‌های ارگانیک و اورجینال', sortOrder: 1 },
        { id: 'svc-8', title: 'صافی و احیا', duration: 180, price: 2500000, categoryId: 'cat-women', description: 'صافی شیمیایی و احیای موهای آسیب‌دیده با استفاده از بهترین محصولات', sortOrder: 2 },
        { id: 'svc-9', title: 'شینیون', duration: 90, price: 800000, categoryId: 'cat-women', description: 'شینیون تخصصی برای مجالس، عروسی و نامزدی با استفاده از تنظیمات برتر', sortOrder: 3 },
        { id: 'svc-10', title: 'بافت مو', duration: 120, price: 700000, categoryId: 'cat-women', description: 'بافت مو فانتزی و مجلسی برای موهای نازک و خروج', sortOrder: 4 },
    ];
    for (const s of servicesData) {
        await prisma.service.upsert({ where: { id: s.id }, update: { price: s.price, duration: s.duration }, create: s });
    }
    console.log(servicesData.length + ' services');

    // ─── Working Hours ──────────────────────────────
    const hoursData = [
        { dayOfWeek: 0, startTime: '09:00', endTime: '20:00', isClosed: false },
        { dayOfWeek: 1, startTime: '09:00', endTime: '20:00', isClosed: false },
        { dayOfWeek: 2, startTime: '09:00', endTime: '20:00', isClosed: false },
        { dayOfWeek: 3, startTime: '09:00', endTime: '20:00', isClosed: false },
        { dayOfWeek: 4, startTime: '10:00', endTime: '17:00', isClosed: false },
        { dayOfWeek: 5, startTime: '00:00', endTime: '00:00', isClosed: true },
        { dayOfWeek: 6, startTime: '09:00', endTime: '20:00', isClosed: false },
    ];
    for (const wh of hoursData) {
        await prisma.workingHours.upsert({
            where: { id: 'wh-' + wh.dayOfWeek },
            update: { startTime: wh.startTime, endTime: wh.endTime, isClosed: wh.isClosed },
            create: { id: 'wh-' + wh.dayOfWeek, dayOfWeek: wh.dayOfWeek, startTime: wh.startTime, endTime: wh.endTime, isClosed: wh.isClosed }
        });
    }
    console.log('Working hours');

    // ─── Breaks ─────────────────────────────────────
    const breakData = [
        { id: 'brk-0', workingHoursId: 'wh-0', startTime: '13:00', endTime: '14:00' },
        { id: 'brk-1', workingHoursId: 'wh-1', startTime: '13:00', endTime: '14:00' },
        { id: 'brk-2', workingHoursId: 'wh-2', startTime: '13:00', endTime: '14:00' },
        { id: 'brk-3', workingHoursId: 'wh-3', startTime: '13:00', endTime: '14:00' },
        { id: 'brk-4', workingHoursId: 'wh-4', startTime: '13:30', endTime: '14:00' },
        { id: 'brk-6', workingHoursId: 'wh-6', startTime: '13:00', endTime: '14:00' },
    ];
    for (const b of breakData) {
        await prisma.break.upsert({ where: { id: b.id }, update: {}, create: b });
    }
    console.log(breakData.length + ' breaks');

    // ─── Sample Bookings ────────────────────────────
    const tomorrow = new Date(); tomorrow.setDate(tomorrow.getDate() + 1); tomorrow.setHours(0, 0, 0, 0);
    const dayAfter = new Date(); dayAfter.setDate(dayAfter.getDate() + 2); dayAfter.setHours(0, 0, 0, 0);
    const bookings = [
        { id: 'bk-1', customer: 'علی رضایی', phone: '09121234567', date: tomorrow, startTime: '10:00', endTime: '11:00', price: 450000, serviceId: 'svc-2', status: 'CONFIRMED' },
        { id: 'bk-2', customer: 'سارا محمدی', phone: '09351234567', date: tomorrow, startTime: '14:00', endTime: '17:00', price: 2500000, serviceId: 'svc-8', status: 'CONFIRMED' },
        { id: 'bk-3', customer: 'میلاد حسینی', phone: '09191234567', date: dayAfter, startTime: '11:00', endTime: '12:30', price: 800000, serviceId: 'svc-9', status: 'PENDING' },
    ];
    for (const b of bookings) {
        await prisma.booking.upsert({ where: { id: b.id }, update: {}, create: b });
    }
    console.log(bookings.length + ' sample bookings');

    // ─── Gallery ────────────────────────────────────
    const galleryItems = [
        { id: 'gi-1', imageUrl: 'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=400', title: 'کوتاهی کلاسیک مردانه', category: 'cut', sortOrder: 0 },
        { id: 'gi-2', imageUrl: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=400', title: 'فید تخصصی مردانه', category: 'cut', sortOrder: 1 },
        { id: 'gi-3', imageUrl: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400', title: 'رنگ مش زنانه', category: 'color', sortOrder: 2 },
        { id: 'gi-4', imageUrl: 'https://images.unsplash.com/photo-1560869713-7d0a29430803?w=400', title: 'شینیون مجلسی', category: 'style', sortOrder: 3 },
    ];
    for (const gi of galleryItems) {
        await prisma.galleryItem.upsert({ where: { id: gi.id }, update: {}, create: gi });
    }
    console.log(galleryItems.length + ' gallery items');

    // ─── Settings ───────────────────────────────────
    const settings = [
        { key: 'site_name', value: 'Hamid Hair Studio' },
        { key: 'site_tagline', value: 'Hair Artist • Men • Women' },
        { key: 'booking_enabled', value: 'true' },
        { key: 'booking_advance_days', value: '30' },
        { key: 'booking_slot_interval', value: '30' },
    ];
    for (const s of settings) {
        await prisma.siteSetting.upsert({ where: { key: s.key }, update: { value: s.value }, create: s });
    }
    console.log(settings.length + ' settings');

    console.log('\nSeed complete!');
    console.log('Admin: admin / admin123');
}

main()
    .catch(function(e) { console.error('Seed error:', e); process.exit(1); })
    .finally(async function() { await prisma.$disconnect(); });
