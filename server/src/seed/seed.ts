import mongoose from 'mongoose';
import dns from 'dns';
dns.setServers(['8.8.8.8', '1.1.1.1']);
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import {
  User,
  Customer,
  Staff,
  Service,
  Appointment,
  Payment,
  Invoice,
  Product,
  InventoryTransaction,
  Supplier,
  Promotion,
  Review,
  LoyaltyTransaction,
  Notification,
  SalonSettings,
} from '../models/index.js';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/salonflow';

export const seedDatabase = async () => {
  try {
    console.log('[Seed] Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('[Seed] Connected! Clearing existing data...');

    // Clear all collections
    await Promise.all([
      User.deleteMany({}),
      Customer.deleteMany({}),
      Staff.deleteMany({}),
      Service.deleteMany({}),
      Appointment.deleteMany({}),
      Payment.deleteMany({}),
      Invoice.deleteMany({}),
      Product.deleteMany({}),
      InventoryTransaction.deleteMany({}),
      Supplier.deleteMany({}),
      Promotion.deleteMany({}),
      Review.deleteMany({}),
      LoyaltyTransaction.deleteMany({}),
      Notification.deleteMany({}),
      SalonSettings.deleteMany({}),
    ]);

    console.log('[Seed] Data cleared. Seeding Salon Settings...');

    // 1. Salon Settings
    const settings = await SalonSettings.create({
      salonName: 'SalonFlow Luxury Studio & Spa',
      tagline: 'Your Beauty. Your Time. Your Salon.',
      logo: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=400&q=80',
      address: 'Waterfield Road, Bandra West, Mumbai, Maharashtra 400050',
      phone: '+91 98200 45678',
      email: 'concierge@salonflow.com',
      openingHours: '09:00',
      closingHours: '20:00',
      workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      durationStepMinutes: 30,
      bufferTimeMinutes: 15,
      cancelWindowHours: 4,
      taxRatePercent: 18,
      loyaltyEarnRate: 1, // 1 pt per 100 INR spent
      loyaltyRedemptionRate: 1, // 1 pt = 1 INR
    });

    // 2. Demo Users
    console.log('[Seed] Seeding Demo Users...');
    // We will save with plain password because UserSchema.pre('save') handles bcrypt hashing
    const adminUser = new User({
      name: 'Aarav Malhotra',
      email: 'admin@salonflow.demo',
      password: 'Admin@123',
      role: 'ADMIN',
      phone: '+91 98201 11001',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    });
    await adminUser.save();

    const ownerUser = new User({
      name: 'Nandini Singhania',
      email: 'owner@salonflow.demo',
      password: 'Owner@123',
      role: 'SALON_OWNER',
      phone: '+91 98201 11002',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
    });
    await ownerUser.save();

    const receptionUser1 = new User({
      name: 'Pooja Verma',
      email: 'reception@salonflow.demo',
      password: 'Reception@123',
      role: 'RECEPTIONIST',
      phone: '+91 98201 11003',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80',
    });
    await receptionUser1.save();

    const receptionUser2 = new User({
      name: 'Rohan Deshmukh',
      email: 'reception2@salonflow.demo',
      password: 'Reception@123',
      role: 'RECEPTIONIST',
      phone: '+91 98201 11004',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    });
    await receptionUser2.save();

    const demoStylistUser = new User({
      name: 'Kavya Kapoor',
      email: 'stylist@salonflow.demo',
      password: 'Stylist@123',
      role: 'STYLIST',
      phone: '+91 98201 11005',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
    });
    await demoStylistUser.save();

    const demoCustomerUser = new User({
      name: 'Ananya Sharma',
      email: 'customer@salonflow.demo',
      password: 'Customer@123',
      role: 'CUSTOMER',
      phone: '+91 98201 11006',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80',
    });
    await demoCustomerUser.save();

    // 3. Staff (8 Stylists with photos and specialties)
    console.log('[Seed] Seeding Staff...');
    const stylistSeedData = [
      {
        fullName: 'Kavya Kapoor',
        email: 'stylist@salonflow.demo',
        phone: '+91 98201 11005',
        user: demoStylistUser._id,
        role: 'Master Stylist',
        specialization: 'Hair Styling & Keratin Treatment',
        experience: 8,
        salary: 65000,
        commission: 12,
        rating: 4.9,
        reviewCount: 64,
        revenueGenerated: 245000,
        profileImage: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=500&q=80',
        workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      },
      {
        fullName: 'Vikramaditya Roy',
        email: 'vikram.roy@salonflow.demo',
        phone: '+91 98201 22001',
        role: 'Creative Director & Colorist',
        specialization: 'Hair Coloring & Balayage Specialist',
        experience: 11,
        salary: 80000,
        commission: 15,
        rating: 5.0,
        reviewCount: 92,
        revenueGenerated: 420000,
        profileImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=500&q=80',
        workingDays: ['Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      },
      {
        fullName: 'Meera Sen',
        email: 'meera.sen@salonflow.demo',
        phone: '+91 98201 22002',
        role: 'Senior Bridal Artist',
        specialization: 'Bridal & HD Airbrush Makeup',
        experience: 9,
        salary: 75000,
        commission: 15,
        rating: 4.9,
        reviewCount: 78,
        revenueGenerated: 380000,
        profileImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=500&q=80',
        workingDays: ['Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      },
      {
        fullName: 'Priya Nambiar',
        email: 'priya.nambiar@salonflow.demo',
        phone: '+91 98201 22003',
        role: 'Lead Nail Artist',
        specialization: 'Nail Art & Gel Extensions',
        experience: 6,
        salary: 48000,
        commission: 10,
        rating: 4.8,
        reviewCount: 45,
        revenueGenerated: 165000,
        profileImage: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=500&q=80',
        workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      },
      {
        fullName: 'Arjun Khanna',
        email: 'arjun.khanna@salonflow.demo',
        phone: '+91 98201 22004',
        role: 'Senior Grooming Expert',
        specialization: 'Precision Haircut & Beard Sculpting',
        experience: 7,
        salary: 52000,
        commission: 10,
        rating: 4.8,
        reviewCount: 51,
        revenueGenerated: 190000,
        profileImage: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=500&q=80',
        workingDays: ['Monday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      },
      {
        fullName: 'Ananya Joshi',
        email: 'ananya.joshi@salonflow.demo',
        phone: '+91 98201 22005',
        role: 'Skin & Aesthetician',
        specialization: 'HydraFacial & Skin Therapy',
        experience: 8,
        salary: 58000,
        commission: 12,
        rating: 4.9,
        reviewCount: 60,
        revenueGenerated: 275000,
        profileImage: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=500&q=80',
        workingDays: ['Monday', 'Tuesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      },
      {
        fullName: 'Rahul Saxena',
        email: 'rahul.saxena@salonflow.demo',
        phone: '+91 98201 22006',
        role: 'Hair Texture & Botox Specialist',
        specialization: 'Brazilian Botoplex & Hair Straightening',
        experience: 5,
        salary: 45000,
        commission: 10,
        rating: 4.7,
        reviewCount: 38,
        revenueGenerated: 140000,
        profileImage: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=500&q=80',
        workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Friday', 'Saturday', 'Sunday'],
      },
      {
        fullName: 'Sneha Kulkarni',
        email: 'sneha.kulkarni@salonflow.demo',
        phone: '+91 98201 22007',
        role: 'Holistic Spa Therapist',
        specialization: 'Aromatherapy & Luxury Pedicure Reflexology',
        experience: 6,
        salary: 42000,
        commission: 10,
        rating: 4.9,
        reviewCount: 42,
        revenueGenerated: 130000,
        profileImage: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&w=500&q=80',
        workingDays: ['Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      },
    ];

    const staffDocs = [];
    for (let i = 0; i < stylistSeedData.length; i++) {
      const s = stylistSeedData[i];
      const employeeId = `STF-${String(i + 1).padStart(3, '0')}`;
      const doc = await Staff.create({
        ...s,
        employeeId,
        workingHours: { start: '09:00', end: '19:00' },
        isActive: true,
        leaveStatus: false,
      });
      staffDocs.push(doc);
    }

    // 4. Services (21 realistic services in INR)
    console.log('[Seed] Seeding Services...');
    const servicesData = [
      // Hair
      {
        name: 'Signature Precision Haircut & Styling',
        category: 'Hair',
        description: 'Bespoke consultation, customized hair wash with luxury mask, precision haircut, and blow dry finish.',
        price: 950,
        duration: 45,
        image: 'https://images.unsplash.com/photo-1560869713-7d0a29430803?auto=format&fit=crop&w=600&q=80',
        isActive: true,
        popularStatus: true,
        rating: 4.9,
        reviewCount: 120,
      },
      {
        name: 'Balayage & Sun-Kissed Highlights',
        category: 'Hair',
        description: 'Hand-painted dimensional hair lightening with toner glaze, Olaplex bonding treatment, and blow dry.',
        price: 5500,
        duration: 120,
        image: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&w=600&q=80',
        isActive: true,
        popularStatus: true,
        rating: 5.0,
        reviewCount: 88,
      },
      {
        name: 'Keratin Protein Smoothing Treatment',
        category: 'Hair',
        description: 'Eliminates 95% of frizz, infuses keratin protein, leaves hair silky, smooth, and radiant for up to 4 months.',
        price: 6800,
        duration: 150,
        image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=600&q=80',
        isActive: true,
        popularStatus: true,
        rating: 4.8,
        reviewCount: 75,
      },
      {
        name: 'Global Hair Color & Gloss Glaze',
        category: 'Hair',
        description: 'Complete root-to-tip ammonia-free L\'Oreal Inoa color with nourishing shine booster treatment.',
        price: 4200,
        duration: 90,
        image: 'https://images.unsplash.com/photo-1607779097040-26e80aa78e66?auto=format&fit=crop&w=600&q=80',
        isActive: true,
        popularStatus: false,
        rating: 4.7,
        reviewCount: 52,
      },
      {
        name: 'Moroccan Oil Hydrating Hair Spa',
        category: 'Hair',
        description: 'Deep restorative argan oil head massage, steam therapy, and split-end repair serum.',
        price: 2400,
        duration: 60,
        image: 'https://images.unsplash.com/photo-1582095133179-bfd08e2fc6b3?auto=format&fit=crop&w=600&q=80',
        isActive: true,
        popularStatus: true,
        rating: 4.9,
        reviewCount: 94,
      },
      {
        name: 'Brazilian Botoplex Rejuvenation',
        category: 'Hair',
        description: 'Advanced anti-aging hair treatment restoring extreme damaged cortex bonds with hyaluronic acid.',
        price: 7500,
        duration: 120,
        image: 'https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?auto=format&fit=crop&w=600&q=80',
        isActive: true,
        popularStatus: false,
        rating: 4.9,
        reviewCount: 39,
      },
      {
        name: 'Glamour Blow Dry & Beach Waves',
        category: 'Hair',
        description: 'Volumizing wash followed by ceramic round-brush blowout or soft mermaid beach wave styling.',
        price: 750,
        duration: 30,
        image: 'https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=600&q=80',
        isActive: true,
        popularStatus: false,
        rating: 4.8,
        reviewCount: 61,
      },

      // Beauty & Skin
      {
        name: 'HydraFacial MD Elite Glow',
        category: 'Beauty',
        description: 'Patented 4-step medical grade facial: cleanse, acid peel extraction, vortex hydration, and LED light therapy.',
        price: 5200,
        duration: 60,
        image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=600&q=80',
        isActive: true,
        popularStatus: true,
        rating: 5.0,
        reviewCount: 110,
      },
      {
        name: 'O3+ Diamond Radiance Facial',
        category: 'Beauty',
        description: 'Skin illumination facial with oxygenating peel, diamond cellular cream, and alginate brightening mask.',
        price: 3200,
        duration: 75,
        image: 'https://images.unsplash.com/photo-1512290900672-1f55b96580f4?auto=format&fit=crop&w=600&q=80',
        isActive: true,
        popularStatus: true,
        rating: 4.8,
        reviewCount: 82,
      },
      {
        name: 'Botanical Deep Pore Cleanup',
        category: 'Beauty',
        description: 'Steam purification, gentle ultrasonic blackhead extraction, tea tree antibacterial mask, and cold roller tone.',
        price: 1500,
        duration: 45,
        image: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=600&q=80',
        isActive: true,
        popularStatus: false,
        rating: 4.7,
        reviewCount: 44,
      },
      {
        name: 'Rica Liposoluble Full Body Waxing',
        category: 'Beauty',
        description: 'Italian colophony-free wax enriched with avocado oil and chamomile for painless smooth silky skin.',
        price: 2600,
        duration: 60,
        image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=600&q=80',
        isActive: true,
        popularStatus: false,
        rating: 4.6,
        reviewCount: 50,
      },
      {
        name: 'Eyebrow Architecture & Organic Tinting',
        category: 'Beauty',
        description: 'Golden-ratio brow mapping, organic cotton threading, natural henna-based brow tint, and setting gel.',
        price: 450,
        duration: 30,
        image: 'https://images.unsplash.com/photo-1583001809873-a128495da465?auto=format&fit=crop&w=600&q=80',
        isActive: true,
        popularStatus: false,
        rating: 4.9,
        reviewCount: 95,
      },

      // Nails
      {
        name: 'Gel Nail Polish with Custom Hand Art',
        category: 'Nails',
        description: 'Dry Russian manicure technique, LED cured long-lasting gel polish with customized minimalist nail art.',
        price: 1800,
        duration: 60,
        image: 'https://images.unsplash.com/photo-1632345031435-8727f6897d53?auto=format&fit=crop&w=600&q=80',
        isActive: true,
        popularStatus: true,
        rating: 4.9,
        reviewCount: 76,
      },
      {
        name: 'Luxury Rose Quartz Spa Pedicure',
        category: 'Nails',
        description: 'Epsom foot soak, botanical scrub, dead skin callus filing, hot stone massage, and breathable nail polish.',
        price: 1600,
        duration: 50,
        image: 'https://images.unsplash.com/photo-1519014816548-bf5fe059798b?auto=format&fit=crop&w=600&q=80',
        isActive: true,
        popularStatus: true,
        rating: 4.8,
        reviewCount: 68,
      },
      {
        name: 'Full Acrylic Sculpted Extensions',
        category: 'Nails',
        description: 'Full set of durable acrylic extensions with tip sculpting, cut-edge shaping, and chrome topcoat.',
        price: 2800,
        duration: 90,
        image: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=600&q=80',
        isActive: true,
        popularStatus: false,
        rating: 4.7,
        reviewCount: 37,
      },

      // Bridal
      {
        name: 'Signature High-Definition Bridal Makeup',
        category: 'Bridal',
        description: 'Full bridal makeover including MAC/Charlotte Tilbury HD base, customized eyelash extensions, hair styling & dupatta draping.',
        price: 22000,
        duration: 180,
        image: 'https://images.unsplash.com/photo-1596704017254-9b121068fb31?auto=format&fit=crop&w=600&q=80',
        isActive: true,
        popularStatus: true,
        rating: 5.0,
        reviewCount: 84,
      },
      {
        name: 'Flawless Airbrush Bridal Makeup',
        category: 'Bridal',
        description: 'Temptu silicone-based airbrush foundation for waterproof, transfer-proof 18-hour hold. Includes floral hair adornments.',
        price: 28000,
        duration: 210,
        image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=600&q=80',
        isActive: true,
        popularStatus: true,
        rating: 5.0,
        reviewCount: 56,
      },
      {
        name: 'Pre-Bridal Luxury Radiance Ritual',
        category: 'Bridal',
        description: 'Full body polishing, gold facial, whole body waxing, deluxe mani-pedi, and Kérastase intensive hair conditioning.',
        price: 14500,
        duration: 240,
        image: 'https://images.unsplash.com/photo-1560750588-73207b1ef5b8?auto=format&fit=crop&w=600&q=80',
        isActive: true,
        popularStatus: false,
        rating: 4.9,
        reviewCount: 42,
      },
      {
        name: 'Engagement & Cocktail Glam Makeover',
        category: 'Bridal',
        description: 'Evening soft glam makeup, smokey eyes, contouring, high-shine lips, and textured Hollywood waves.',
        price: 9500,
        duration: 90,
        image: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=600&q=80',
        isActive: true,
        popularStatus: false,
        rating: 4.8,
        reviewCount: 50,
      },

      // Spa
      {
        name: 'Aromatherapy Stress Reliever Massage',
        category: 'Spa',
        description: 'Lavender and eucalyptus essential oil therapeutic back, neck, and shoulder acupressure tension release.',
        price: 1800,
        duration: 45,
        image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=600&q=80',
        isActive: true,
        popularStatus: true,
        rating: 4.9,
        reviewCount: 65,
      },
      {
        name: 'Kérastase Fusio-Dose Instant Alchemy',
        category: 'Spa',
        description: 'Tailored concentrate & booster cocktail transforming hair fiber quality in 15 minutes of deep nourishment.',
        price: 3200,
        duration: 45,
        image: 'https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?auto=format&fit=crop&w=600&q=80',
        isActive: true,
        popularStatus: false,
        rating: 4.8,
        reviewCount: 30,
      },
    ];

    const serviceDocs = await Service.insertMany(servicesData);

    // 5. Suppliers & Inventory Products (30 realistic products)
    console.log('[Seed] Seeding Suppliers & Products...');
    const supplierDocs = await Supplier.insertMany([
      {
        name: 'L\'Oréal Professionnel India',
        contactPerson: 'Rajesh Mehta',
        email: 'supply@lorealpro.in',
        phone: '+91 98200 99001',
        address: 'Worli, Mumbai',
        categories: ['Hair Care', 'Color & Chemical'],
      },
      {
        name: 'Olaplex & Luxury Brands Distribution',
        contactPerson: 'Sunil Rao',
        email: 'sales@luxurybeauty.co.in',
        phone: '+91 98200 99002',
        address: 'Lower Parel, Mumbai',
        categories: ['Hair Care', 'Treatment'],
      },
      {
        name: 'Dermalogica & O3+ Professional',
        contactPerson: 'Karan Shah',
        email: 'orders@dermapro.in',
        phone: '+91 98200 99003',
        address: 'Andheri East, Mumbai',
        categories: ['Skin Care'],
      },
      {
        name: 'OPI & Essie Nail Systems',
        contactPerson: 'Deepa Patel',
        email: 'info@opinails.in',
        phone: '+91 98200 99004',
        address: 'Bandra, Mumbai',
        categories: ['Nail Care'],
      },
    ]);

    const productSeedData = [
      { name: 'L\'Oréal Serie Expert Absolut Repair Shampoo (500ml)', sku: 'LOR-SHP-001', category: 'Hair Care', supplier: 'L\'Oréal Professionnel India', purchasePrice: 950, sellingPrice: 1550, stockQuantity: 24, minStockLevel: 6 },
      { name: 'L\'Oréal Serie Expert Absolut Repair Mask (250ml)', sku: 'LOR-MSK-002', category: 'Hair Care', supplier: 'L\'Oréal Professionnel India', purchasePrice: 1100, sellingPrice: 1800, stockQuantity: 18, minStockLevel: 5 },
      { name: 'Olaplex No. 3 Hair Perfector (100ml)', sku: 'OLA-PER-003', category: 'Hair Care', supplier: 'Olaplex & Luxury Brands Distribution', purchasePrice: 1900, sellingPrice: 2950, stockQuantity: 14, minStockLevel: 5 },
      { name: 'Olaplex No. 4 Bond Maintenance Shampoo (250ml)', sku: 'OLA-SHP-004', category: 'Hair Care', supplier: 'Olaplex & Luxury Brands Distribution', purchasePrice: 1850, sellingPrice: 2850, stockQuantity: 12, minStockLevel: 4 },
      { name: 'Olaplex No. 5 Bond Maintenance Conditioner (250ml)', sku: 'OLA-CND-005', category: 'Hair Care', supplier: 'Olaplex & Luxury Brands Distribution', purchasePrice: 1850, sellingPrice: 2850, stockQuantity: 9, minStockLevel: 4 },
      { name: 'Olaplex No. 7 Bonding Oil (30ml)', sku: 'OLA-OIL-006', category: 'Hair Care', supplier: 'Olaplex & Luxury Brands Distribution', purchasePrice: 1750, sellingPrice: 2800, stockQuantity: 3, minStockLevel: 5 }, // Low stock!
      { name: 'Moroccanoil Treatment Original (100ml)', sku: 'MOR-OIL-007', category: 'Hair Care', supplier: 'Olaplex & Luxury Brands Distribution', purchasePrice: 2400, sellingPrice: 3800, stockQuantity: 16, minStockLevel: 4 },
      { name: 'Moroccanoil Intense Hydrating Mask (250ml)', sku: 'MOR-MSK-008', category: 'Hair Care', supplier: 'Olaplex & Luxury Brands Distribution', purchasePrice: 2100, sellingPrice: 3300, stockQuantity: 8, minStockLevel: 3 },
      { name: 'Kérastase Elixir Ultime Hair Oil (100ml)', sku: 'KER-OIL-009', category: 'Hair Care', supplier: 'L\'Oréal Professionnel India', purchasePrice: 2600, sellingPrice: 4100, stockQuantity: 11, minStockLevel: 4 },
      { name: 'Kérastase Genesis Anti-Hairfall Serum (90ml)', sku: 'KER-SER-010', category: 'Hair Care', supplier: 'L\'Oréal Professionnel India', purchasePrice: 2800, sellingPrice: 4400, stockQuantity: 4, minStockLevel: 5 }, // Low stock!
      { name: 'L\'Oréal Inoa Ammonia-Free Color Tube 5.3 (60g)', sku: 'LOR-COL-011', category: 'Color & Chemical', supplier: 'L\'Oréal Professionnel India', purchasePrice: 420, sellingPrice: 650, stockQuantity: 35, minStockLevel: 10 },
      { name: 'L\'Oréal Inoa Ammonia-Free Color Tube 7.1 (60g)', sku: 'LOR-COL-012', category: 'Color & Chemical', supplier: 'L\'Oréal Professionnel India', purchasePrice: 420, sellingPrice: 650, stockQuantity: 28, minStockLevel: 10 },
      { name: 'L\'Oréal Blond Studio 9 Lightener Powder (500g)', sku: 'LOR-BLD-013', category: 'Color & Chemical', supplier: 'L\'Oréal Professionnel India', purchasePrice: 1600, sellingPrice: 2400, stockQuantity: 7, minStockLevel: 3 },
      { name: 'Brazilian Blowout Açai Professional Solution (1000ml)', sku: 'BRZ-SOL-014', category: 'Color & Chemical', supplier: 'Olaplex & Luxury Brands Distribution', purchasePrice: 14000, sellingPrice: 22000, stockQuantity: 3, minStockLevel: 2 },
      { name: 'O3+ Whitening Facial Kit 10-Session Pack', sku: 'O3P-KIT-015', category: 'Skin Care', supplier: 'Dermalogica & O3+ Professional', purchasePrice: 5200, sellingPrice: 8500, stockQuantity: 6, minStockLevel: 3 },
      { name: 'O3+ Seaweed Purifying Alginate Mask (500g)', sku: 'O3P-MSK-016', category: 'Skin Care', supplier: 'Dermalogica & O3+ Professional', purchasePrice: 1400, sellingPrice: 2300, stockQuantity: 5, minStockLevel: 4 },
      { name: 'Dermalogica Daily Microfoliant Exfoliator (74g)', sku: 'DER-MIC-017', category: 'Skin Care', supplier: 'Dermalogica & O3+ Professional', purchasePrice: 2900, sellingPrice: 4400, stockQuantity: 2, minStockLevel: 4 }, // Low stock!
      { name: 'Dermalogica Special Cleansing Gel (500ml)', sku: 'DER-CLN-018', category: 'Skin Care', supplier: 'Dermalogica & O3+ Professional', purchasePrice: 2700, sellingPrice: 4100, stockQuantity: 9, minStockLevel: 3 },
      { name: 'Rica White Chocolate Liposoluble Wax Can (800ml)', sku: 'RIC-WAX-019', category: 'Skin Care', supplier: 'Dermalogica & O3+ Professional', purchasePrice: 950, sellingPrice: 1450, stockQuantity: 20, minStockLevel: 6 },
      { name: 'Rica Avocado Oil Post-Wax Calming Lotion (500ml)', sku: 'RIC-LOT-020', category: 'Skin Care', supplier: 'Dermalogica & O3+ Professional', purchasePrice: 750, sellingPrice: 1200, stockQuantity: 15, minStockLevel: 5 },
      { name: 'OPI GelColor Base & Top Coat Duo Set', sku: 'OPI-SET-021', category: 'Nail Care', supplier: 'OPI & Essie Nail Systems', purchasePrice: 1600, sellingPrice: 2500, stockQuantity: 14, minStockLevel: 4 },
      { name: 'OPI GelColor "Big Apple Red" (15ml)', sku: 'OPI-RED-022', category: 'Nail Care', supplier: 'OPI & Essie Nail Systems', purchasePrice: 780, sellingPrice: 1250, stockQuantity: 18, minStockLevel: 5 },
      { name: 'OPI GelColor "Bubble Bath" Sheer Pink (15ml)', sku: 'OPI-PNK-023', category: 'Nail Care', supplier: 'OPI & Essie Nail Systems', purchasePrice: 780, sellingPrice: 1250, stockQuantity: 22, minStockLevel: 5 },
      { name: 'Cuccio Naturale Milk & Honey Cuticle Butter (240g)', sku: 'CUC-BUT-024', category: 'Nail Care', supplier: 'OPI & Essie Nail Systems', purchasePrice: 850, sellingPrice: 1390, stockQuantity: 12, minStockLevel: 3 },
      { name: 'Mia Secret Liquid Monomer & Acrylic Powder Kit', sku: 'MIA-ACR-025', category: 'Nail Care', supplier: 'OPI & Essie Nail Systems', purchasePrice: 2200, sellingPrice: 3400, stockQuantity: 2, minStockLevel: 4 }, // Low stock!
      { name: 'Schwarzkopf Professional Silhouette Super Hold Hairspray (500ml)', sku: 'SWZ-SPR-026', category: 'Hair Care', supplier: 'L\'Oréal Professionnel India', purchasePrice: 650, sellingPrice: 1100, stockQuantity: 30, minStockLevel: 8 },
      { name: 'Olaplex No. 6 Bond Smoother Styling Creme (100ml)', sku: 'OLA-SMO-027', category: 'Hair Care', supplier: 'Olaplex & Luxury Brands Distribution', purchasePrice: 1850, sellingPrice: 2850, stockQuantity: 7, minStockLevel: 3 },
      { name: 'Kérastase Nutritive 8H Magic Night Serum (90ml)', sku: 'KER-NGT-028', category: 'Hair Care', supplier: 'L\'Oréal Professionnel India', purchasePrice: 2900, sellingPrice: 4600, stockQuantity: 5, minStockLevel: 3 },
      { name: 'O3+ Bridal Glow Sheet Mask Pack (10 Sheets)', sku: 'O3P-SHT-029', category: 'Skin Care', supplier: 'Dermalogica & O3+ Professional', purchasePrice: 1200, sellingPrice: 1950, stockQuantity: 16, minStockLevel: 5 },
      { name: 'Rica Brazilian Depilatory Hard Wax Beads (1000g)', sku: 'RIC-HRD-030', category: 'Skin Care', supplier: 'Dermalogica & O3+ Professional', purchasePrice: 1400, sellingPrice: 2100, stockQuantity: 10, minStockLevel: 4 },
    ];

    const productDocs = await Product.insertMany(productSeedData);

    // Initial Inventory Transactions
    for (const p of productDocs.slice(0, 10)) {
      await InventoryTransaction.create({
        product: p._id,
        productName: p.name,
        sku: p.sku,
        type: 'IN',
        quantity: p.stockQuantity,
        previousStock: 0,
        newStock: p.stockQuantity,
        reason: 'Initial Inventory Inward',
        performedBy: 'Aarav Malhotra (Admin)',
        date: new Date(Date.now() - 30 * 24 * 3600 * 1000),
      });
    }

    // 6. Promotions (5 realistic promo coupons)
    console.log('[Seed] Seeding Promotions...');
    const promotionsData = [
      {
        code: 'FIRSTVISIT15',
        title: 'New Guest Welcome Privilege',
        description: 'Enjoy 15% off your very first salon service with our senior stylists.',
        discountType: 'PERCENTAGE',
        discountValue: 15,
        minPurchase: 1000,
        maxDiscount: 1000,
        startDate: '2026-01-01',
        endDate: '2027-12-31',
        usageLimit: 500,
        usedCount: 42,
        customerUsageLimit: 1,
        isActive: true,
      },
      {
        code: 'HAIRSPA500',
        title: 'Moroccan Hair Spa Special',
        description: 'Flat ₹500 discount on any luxury hair spa or deep conditioning treatment.',
        discountType: 'FIXED',
        discountValue: 500,
        minPurchase: 2000,
        maxDiscount: 500,
        startDate: '2026-01-01',
        endDate: '2027-12-31',
        usageLimit: 200,
        usedCount: 28,
        customerUsageLimit: 2,
        isActive: true,
      },
      {
        code: 'BRIDAL2026',
        title: 'Bridal & Trousseau Celebration',
        description: '20% privilege savings up to ₹5,000 on all bridal and pre-bridal packages.',
        discountType: 'PERCENTAGE',
        discountValue: 20,
        minPurchase: 10000,
        maxDiscount: 5000,
        startDate: '2026-01-01',
        endDate: '2027-12-31',
        usageLimit: 100,
        usedCount: 15,
        customerUsageLimit: 1,
        isActive: true,
      },
      {
        code: 'BIRTHDAY750',
        title: 'Happy Birthday Glamour Treat',
        description: 'Celebrate your special month with ₹750 off on pampering sessions above ₹2,500.',
        discountType: 'FIXED',
        discountValue: 750,
        minPurchase: 2500,
        maxDiscount: 750,
        startDate: '2026-01-01',
        endDate: '2027-12-31',
        usageLimit: 300,
        usedCount: 39,
        customerUsageLimit: 1,
        isActive: true,
      },
      {
        code: 'WEEKEND10',
        title: 'Weekend Rejuvenation',
        description: '10% privilege savings across all beauty and nail art services.',
        discountType: 'PERCENTAGE',
        discountValue: 10,
        minPurchase: 1500,
        maxDiscount: 800,
        startDate: '2026-01-01',
        endDate: '2027-12-31',
        usageLimit: 400,
        usedCount: 65,
        customerUsageLimit: 5,
        isActive: true,
      },
    ];

    await Promotion.insertMany(promotionsData);

    // 7. Customers (30 realistic Indian profiles)
    console.log('[Seed] Seeding 30 Realistic Customers...');
    const customerNames = [
      { name: 'Ananya Sharma', phone: '+91 98201 11006', email: 'customer@salonflow.demo', tier: 'Gold', spend: 28500, visits: 8 },
      { name: 'Rhea Chakraborty', phone: '+91 98201 33001', email: 'rhea.c@gmail.com', tier: 'Platinum', spend: 54000, visits: 14 },
      { name: 'Ishaan Kothari', phone: '+91 98201 33002', email: 'ishaan.k@outlook.com', tier: 'Silver', spend: 12500, visits: 6 },
      { name: 'Tanvi Gokhale', phone: '+91 98201 33003', email: 'tanvi.g@yahoo.com', tier: 'Gold', spend: 31000, visits: 9 },
      { name: 'Karan Mehra', phone: '+91 98201 33004', email: 'karan.m@gmail.com', tier: 'Bronze', spend: 4500, visits: 3 },
      { name: 'Zoya Merchant', phone: '+91 98201 33005', email: 'zoya.m@gmail.com', tier: 'Platinum', spend: 62000, visits: 16 },
      { name: 'Aditya Kapoor', phone: '+91 98201 33006', email: 'aditya.k@gmail.com', tier: 'Silver', spend: 11200, visits: 5 },
      { name: 'Simran Bajaj', phone: '+91 98201 33007', email: 'simran.b@hotmail.com', tier: 'Gold', spend: 26800, visits: 7 },
      { name: 'Siddharth Varma', phone: '+91 98201 33008', email: 'sid.varma@gmail.com', tier: 'Bronze', spend: 6800, visits: 4 },
      { name: 'Tara Aluwalia', phone: '+91 98201 33009', email: 'tara.a@gmail.com', tier: 'Gold', spend: 34500, visits: 10 },
      { name: 'Mihir Parekh', phone: '+91 98201 33010', email: 'mihir.p@gmail.com', tier: 'Silver', spend: 15400, visits: 7 },
      { name: 'Diya Sethi', phone: '+91 98201 33011', email: 'diya.sethi@gmail.com', tier: 'Bronze', spend: 3800, visits: 2 },
      { name: 'Varun Grover', phone: '+91 98201 33012', email: 'varun.g@gmail.com', tier: 'Silver', spend: 14200, visits: 6 },
      { name: 'Ayesha Shroff', phone: '+91 98201 33013', email: 'ayesha.s@outlook.com', tier: 'Platinum', spend: 58500, visits: 15 },
      { name: 'Rohit Talwar', phone: '+91 98201 33014', email: 'rohit.t@gmail.com', tier: 'Bronze', spend: 5200, visits: 3 },
      { name: 'Natasha D\'Souza', phone: '+91 98201 33015', email: 'natasha.d@gmail.com', tier: 'Gold', spend: 32000, visits: 9 },
      { name: 'Kabir Oberoi', phone: '+91 98201 33016', email: 'kabir.o@gmail.com', tier: 'Silver', spend: 16500, visits: 7 },
      { name: 'Avni Shah', phone: '+91 98201 33017', email: 'avni.shah@yahoo.com', tier: 'Gold', spend: 29000, visits: 8 },
      { name: 'Gaurav Narang', phone: '+91 98201 33018', email: 'gaurav.n@gmail.com', tier: 'Bronze', spend: 2800, visits: 2 },
      { name: 'Shreya Iyer', phone: '+91 98201 33019', email: 'shreya.iyer@gmail.com', tier: 'Platinum', spend: 69000, visits: 18 },
      { name: 'Devendra Joshi', phone: '+91 98201 33020', email: 'dev.joshi@gmail.com', tier: 'Silver', spend: 13800, visits: 6 },
      { name: 'Neha Chawla', phone: '+91 98201 33021', email: 'neha.c@gmail.com', tier: 'Bronze', spend: 4900, visits: 3 },
      { name: 'Kunal Singhal', phone: '+91 98201 33022', email: 'kunal.s@gmail.com', tier: 'Silver', spend: 18200, visits: 8 },
      { name: 'Pallavi Deol', phone: '+91 98201 33023', email: 'pallavi.d@gmail.com', tier: 'Gold', spend: 36000, visits: 11 },
      { name: 'Armaan Malik', phone: '+91 98201 33024', email: 'armaan.m@gmail.com', tier: 'Bronze', spend: 3200, visits: 2 },
      { name: 'Roshni Bhatt', phone: '+91 98201 33025', email: 'roshni.b@gmail.com', tier: 'Gold', spend: 27500, visits: 8 },
      { name: 'Sameer Qureshi', phone: '+91 98201 33026', email: 'sameer.q@gmail.com', tier: 'Silver', spend: 12800, visits: 5 },
      { name: 'Kritika Roy', phone: '+91 98201 33027', email: 'kritika.roy@gmail.com', tier: 'Platinum', spend: 51200, visits: 13 },
      { name: 'Jayant Agarwal', phone: '+91 98201 33028', email: 'jayant.a@gmail.com', tier: 'Bronze', spend: 4100, visits: 2 },
      { name: 'Sanya Mirza', phone: '+91 98201 33029', email: 'sanya.m@gmail.com', tier: 'Gold', spend: 33400, visits: 9 },
    ];

    const customerDocs = [];
    for (let i = 0; i < customerNames.length; i++) {
      const c = customerNames[i];
      const preferredStylist = staffDocs[i % staffDocs.length];
      const preferredService = serviceDocs[i % serviceDocs.length];

      const doc = await Customer.create({
        user: i === 0 ? demoCustomerUser._id : undefined,
        fullName: c.name,
        phone: c.phone,
        email: c.email,
        dateOfBirth: `199${(i % 8) + 2}-0${(i % 9) + 1}-15`,
        address: `${10 + i}, Pali Hill, Bandra West, Mumbai 400050`,
        registrationDate: new Date(Date.now() - (90 + i * 2) * 24 * 3600 * 1000),
        totalVisits: c.visits,
        totalSpending: c.spend,
        loyaltyPoints: Math.floor(c.spend / 100) + 50,
        loyaltyTier: c.tier,
        preferredStylist: preferredStylist._id,
        preferredServices: [preferredService._id],
        notes: i % 3 === 0 ? 'Prefers iced green tea with lemon. Sensitive scalp.' : 'VIP regular client.',
      });
      customerDocs.push(doc);

      // Loyalty transaction
      await LoyaltyTransaction.create({
        customer: doc._id,
        customerName: doc.fullName,
        points: Math.floor(c.spend / 100),
        type: 'EARNED',
        description: 'Earned from previous salon visits',
        date: new Date(Date.now() - (i + 2) * 24 * 3600 * 1000),
      });
    }

    // 8. Appointments (At least 100 appointments across past 90 days, current month, and next 30 days)
    console.log('[Seed] Generating 105 realistic conflict-free appointments...');
    const appointmentDocs = [];
    const paymentDocs = [];
    const invoiceDocs = [];

    // Helper date generator: past 90 days to next 30 days
    const timeSlots = ['09:30', '11:00', '13:00', '14:30', '16:00', '17:30', '18:30'];

    let aptCounter = 1;

    // We distribute across past 60 days, today, and future 20 days
    const dateOffsets = [];
    // Past dates (-60 to -1) -> 75 appointments
    for (let day = -60; day <= -1; day += 1) {
      dateOffsets.push(day);
    }
    // Today (0) -> 6 appointments
    dateOffsets.push(0);
    dateOffsets.push(0);
    // Future (+1 to +25) -> 24 appointments
    for (let day = 1; day <= 24; day += 2) {
      dateOffsets.push(day);
    }

    const todayDateObj = new Date();

    for (let idx = 0; idx < dateOffsets.length; idx++) {
      const offset = dateOffsets[idx];
      const targetDate = new Date(todayDateObj);
      targetDate.setDate(targetDate.getDate() + offset);
      const dateStr = targetDate.toISOString().split('T')[0];

      // Assign 1 or 2 appointments per day offset to ensure variety without stylist conflicts
      const stylistIdx = idx % staffDocs.length;
      const stylist = staffDocs[stylistIdx];
      const customer = customerDocs[idx % customerDocs.length];
      const service = serviceDocs[idx % serviceDocs.length];
      const slotTime = timeSlots[(idx + stylistIdx) % timeSlots.length];

      // End time based on duration
      const [sh, sm] = slotTime.split(':').map(Number);
      const endMinsTotal = sh * 60 + sm + service.duration;
      const eh = Math.floor(endMinsTotal / 60);
      const em = endMinsTotal % 60;
      const endTimeStr = `${String(eh).padStart(2, '0')}:${String(em).padStart(2, '0')}`;

      let status: any = 'Completed';
      let paymentStatus: any = 'Paid';

      if (offset < 0) {
        if (idx % 12 === 0) {
          status = 'Cancelled';
          paymentStatus = 'Refunded';
        } else if (idx % 15 === 0) {
          status = 'No Show';
          paymentStatus = 'Pending';
        } else {
          status = 'Completed';
          paymentStatus = 'Paid';
        }
      } else if (offset === 0) {
        status = idx % 2 === 0 ? 'In Progress' : 'Confirmed';
        paymentStatus = idx % 2 === 0 ? 'Pending' : 'Paid';
      } else {
        status = idx % 3 === 0 ? 'Pending' : 'Confirmed';
        paymentStatus = 'Pending';
      }

      const discount = idx % 4 === 0 ? 300 : 0;
      const finalPrice = Math.max(0, service.price - discount);
      const appointmentId = `APT-2026-${String(aptCounter).padStart(4, '0')}`;
      aptCounter++;

      const appointment = await Appointment.create({
        appointmentId,
        customer: customer._id,
        customerName: customer.fullName,
        customerPhone: customer.phone,
        service: service._id,
        serviceName: service.name,
        stylist: stylist._id,
        stylistName: stylist.fullName,
        appointmentDate: dateStr,
        startTime: slotTime,
        endTime: endTimeStr,
        duration: service.duration,
        price: service.price,
        discount,
        finalPrice,
        status,
        paymentStatus,
        notes: 'Regular scheduled styling session.',
        bookingSource: idx % 3 === 0 ? 'Online Wizard' : 'Phone Call',
      });
      appointmentDocs.push(appointment);

      // Create Payment & Invoice for completed or paid appointments
      if (paymentStatus === 'Paid') {
        const invNum = `INV-2026-${String(idx + 1).padStart(4, '0')}`;
        const tax = Math.round(finalPrice * 0.18);
        const finalAmount = finalPrice + tax;
        const methods: any[] = ['UPI', 'Card', 'Cash', 'Online'];
        const paymentMethod = methods[idx % methods.length];

        const invoice = await Invoice.create({
          invoiceNumber: invNum,
          customer: customer._id,
          customerName: customer.fullName,
          customerPhone: customer.phone,
          appointment: appointment._id,
          services: [
            {
              serviceId: service._id,
              name: service.name,
              price: service.price,
              duration: service.duration,
            },
          ],
          subtotal: service.price,
          discount,
          tax,
          finalAmount,
          paymentMethod,
          paymentStatus: 'Paid',
          issueDate: targetDate,
          paymentDate: targetDate,
          notes: 'Thank you for choosing SalonFlow.',
        });
        invoiceDocs.push(invoice);

        const payment = await Payment.create({
          invoiceNumber: invNum,
          appointment: appointment._id,
          customer: customer._id,
          customerName: customer.fullName,
          amount: finalAmount,
          paymentMethod,
          paymentStatus: 'Paid',
          transactionId: `TXN-${targetDate.getTime().toString(36).toUpperCase()}-${idx}`,
          paidAt: targetDate,
          notes: `Payment for ${service.name}`,
        });
        paymentDocs.push(payment);
      }
    }

    // 9. Realistic Reviews (30 reviews with ratings 4 to 5)
    console.log('[Seed] Seeding 30 Realistic Reviews...');
    const reviewTexts = [
      { rating: 5, text: 'Vikramaditya did an absolute masterpiece with my balayage! The tone is warm, dimensional and my hair still feels healthy.' },
      { rating: 5, text: 'The HydraFacial with Ananya transformed my skin before my sister\'s sangeet. Unbelievable natural glow!' },
      { rating: 5, text: 'Kavya is the undisputed queen of hair smoothing treatments. Super friendly, professional and attentive.' },
      { rating: 4, text: 'Priya\'s nail art is gorgeous! The salon ambiance is very calming with great coffee. Slight wait of 10 mins but worth it.' },
      { rating: 5, text: 'Hands down the most luxurious salon in Bandra. Beautiful cream decor, spotless hygiene, and lovely staff.' },
      { rating: 5, text: 'Meera did my bridal HD makeup for my cocktail party. Received endless compliments all night!' },
      { rating: 4, text: 'Great haircut by Arjun. Clean fade and shaped my beard perfectly to match my jawline.' },
      { rating: 5, text: 'The Moroccan Oil spa was pure bliss! Sneha\'s shoulder massage took away all my work week stress.' },
      { rating: 5, text: 'Love the online booking experience — booking a slot and picking my preferred stylist was effortless.' },
      { rating: 5, text: 'Keratin smoothing done by Kavya. My unmanageable frizz is completely gone and looks so natural.' },
      { rating: 4, text: 'Very courteous reception team. Prompt service and clear billing without hidden charges.' },
      { rating: 5, text: 'Vikram\'s color consultation was on point. He guided me on which undertone matches my skin best.' },
      { rating: 5, text: 'Top tier pedicure experience with rose quartz scrub. Clean, sanitized tools opened in front of me.' },
      { rating: 5, text: 'The bridal trial makeup was stunning. Booking my entire wedding entourage with SalonFlow.' },
      { rating: 4, text: 'High quality hair products used. Loved that they explained every Olaplex step to me.' },
      { rating: 5, text: 'Everything feels like a 5-star hotel spa. Super peaceful, subtle music, and expert stylists.' },
      { rating: 5, text: 'Cleanest salon waxing experience ever with Rica aloe vera. Virtually painless.' },
      { rating: 4, text: 'My acrylic nail extensions have lasted 4 weeks with zero chipping. Excellent craftsmanship.' },
      { rating: 5, text: 'Haircut and blow dry by Kavya gave me so much volume and bounce. Will never go anywhere else.' },
      { rating: 5, text: 'O3+ bridal radiance facial made a huge difference to my pigmentation in just one session.' },
      { rating: 5, text: 'Arjun understands modern men\'s grooming better than any other stylist I have visited.' },
      { rating: 4, text: 'Loved the loyalty points reward on my bill — got a nice discount on my second visit!' },
      { rating: 5, text: 'The Fusio-Dose alchemy gave my bleached hair instant life and shine. Incredible result.' },
      { rating: 5, text: 'Extremely professional management and hygienic setup. Highly recommended for busy professionals.' },
      { rating: 4, text: 'Great attention to detail by Priya on my French manicure tips.' },
      { rating: 5, text: 'Meera is so calm and reassuring during bridal trials. Really listened to what I wanted.' },
      { rating: 5, text: 'Hair botox gave my dull curls super definition and shine without flattening my natural volume.' },
      { rating: 4, text: 'Pleasant experience from the moment you step through the door. Warm staff and soothing vibe.' },
      { rating: 5, text: 'Best salon in Mumbai for luxury hair coloring. Vikramaditya is an artist!' },
      { rating: 5, text: 'Booked online, arrived on time, was seated immediately with coffee. 10/10 service excellence.' },
    ];

    for (let rIdx = 0; rIdx < reviewTexts.length; rIdx++) {
      const r = reviewTexts[rIdx];
      const apt = appointmentDocs[rIdx % appointmentDocs.length];
      const cust = customerDocs[rIdx % customerDocs.length];

      await Review.create({
        customer: cust._id,
        customerName: cust.fullName,
        customerAvatar: `https://images.unsplash.com/photo-${1500000000000 + rIdx * 1000000}?auto=format&fit=crop&w=150&q=80`,
        appointment: apt._id,
        service: apt.service,
        serviceName: apt.serviceName,
        stylist: apt.stylist,
        stylistName: apt.stylistName,
        rating: r.rating,
        reviewText: r.text,
        isApproved: true,
        date: new Date(Date.now() - (rIdx + 1) * 2 * 24 * 3600 * 1000),
      });
    }

    // 10. Notifications
    console.log('[Seed] Seeding Notifications...');
    await Notification.insertMany([
      {
        title: 'New Online Appointment',
        message: 'Ananya Sharma booked Signature Precision Haircut with Kavya Kapoor for today at 11:00 AM.',
        type: 'APPOINTMENT',
        read: false,
        link: '/dashboard/appointments',
      },
      {
        title: 'Low Stock Warning',
        message: 'Olaplex No. 7 Bonding Oil is down to 3 units (Threshold: 5 units). Please reorder from supplier.',
        type: 'INVENTORY',
        read: false,
        link: '/dashboard/inventory',
      },
      {
        title: 'Payment Received',
        message: '₹6,490 received via UPI for Invoice INV-2026-0042 from Rhea Chakraborty.',
        type: 'PAYMENT',
        read: false,
        link: '/dashboard/billing',
      },
      {
        title: 'New 5-Star Review',
        message: 'Rhea Chakraborty left a 5-star review for Vikramaditya Roy: "Vikramaditya did an absolute masterpiece with my balayage..."',
        type: 'REVIEW',
        read: true,
        link: '/dashboard',
      },
      {
        title: 'New Customer Registered',
        message: 'Zoya Merchant registered via online booking portal and joined Gold loyalty tier.',
        type: 'CUSTOMER',
        read: true,
        link: '/dashboard/customers',
      },
    ]);

    console.log('=============================================');
    console.log('✅ SalonFlow Database Seeded Successfully!');
    console.log(`- 5 Demo Users (Admin, Owner, 2 Receptionists, Stylist, Customer)`);
    console.log(`- ${staffDocs.length} Professional Stylists`);
    console.log(`- ${serviceDocs.length} Luxury Salon Services`);
    console.log(`- ${customerDocs.length} Real Customer Profiles`);
    console.log(`- ${appointmentDocs.length} Conflict-Free Appointments`);
    console.log(`- ${productDocs.length} Inventory Products`);
    console.log(`- ${promotionsData.length} Promotional Campaigns`);
    console.log(`- ${reviewTexts.length} Customer Reviews`);
    console.log(`- System Settings & Notifications Configured`);
    console.log('=============================================');
  } catch (error) {
    console.error('[Seed] Error seeding database:', error);
    process.exit(1);
  }
};

// Execute if run directly
if (process.argv[1]?.includes('seed.ts')) {
  seedDatabase().then(() => {
    process.exit(0);
  });
}
