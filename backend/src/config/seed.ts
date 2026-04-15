import 'dotenv/config';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { User, UserRole } from '../models/User';
import { Vendor } from '../models/Vendor';
import { ServiceProvider, VerificationStatus } from '../models/ServiceProvider';
import { Product } from '../models/Product';
import { Service } from '../models/Service';

const seed = async () => {
  await mongoose.connect(process.env.MONGO_URI as string);
  console.log('Connected to MongoDB');

  // Clear existing data
  await Promise.all([
    User.deleteMany({}),
    Vendor.deleteMany({}),
    ServiceProvider.deleteMany({}),
    Product.deleteMany({}),
    Service.deleteMany({}),
  ]);
  console.log('Cleared existing data');

  // --- Create Vendor Users ---
  const vendorUsers = await User.insertMany([
    { name: 'Ravi Kirana Store', email: 'ravi@locallink.com', password: await bcrypt.hash('password123', 10), role: UserRole.VENDOR },
    { name: 'Tech Zone Electronics', email: 'techzone@locallink.com', password: await bcrypt.hash('password123', 10), role: UserRole.VENDOR },
    { name: 'MedPlus Pharmacy', email: 'medplus@locallink.com', password: await bcrypt.hash('password123', 10), role: UserRole.VENDOR },
    { name: 'BuildRight Hardware', email: 'buildright@locallink.com', password: await bcrypt.hash('password123', 10), role: UserRole.VENDOR },
    { name: 'Style Hub Clothing', email: 'stylehub@locallink.com', password: await bcrypt.hash('password123', 10), role: UserRole.VENDOR },
  ]);

  // --- Create Vendor Profiles ---
  const vendors = await Vendor.insertMany([
    { userId: vendorUsers[0]._id, shopName: 'Ravi Kirana Store', shopAddress: '12 MG Road, Pune', businessLicense: 'LIC-001', isVerified: true },
    { userId: vendorUsers[1]._id, shopName: 'Tech Zone Electronics', shopAddress: '45 FC Road, Pune', businessLicense: 'LIC-002', isVerified: true },
    { userId: vendorUsers[2]._id, shopName: 'MedPlus Pharmacy', shopAddress: '8 Baner Road, Pune', businessLicense: 'LIC-003', isVerified: true },
    { userId: vendorUsers[3]._id, shopName: 'BuildRight Hardware', shopAddress: '22 Kothrud, Pune', businessLicense: 'LIC-004', isVerified: true },
    { userId: vendorUsers[4]._id, shopName: 'Style Hub Clothing', shopAddress: '5 Camp Area, Pune', businessLicense: 'LIC-005', isVerified: true },
  ]);

  // --- Create Products ---
  await Product.insertMany([
    // Groceries
    { vendorId: vendors[0]._id, name: 'Basmati Rice 5kg', description: 'Premium aged basmati rice', price: 320, stock: 80, category: 'Groceries', isActive: true },
    { vendorId: vendors[0]._id, name: 'Toor Dal 1kg', description: 'Fresh toor dal, protein rich', price: 140, stock: 120, category: 'Groceries', isActive: true },
    { vendorId: vendors[0]._id, name: 'Sunflower Oil 1L', description: 'Refined sunflower cooking oil', price: 180, stock: 60, category: 'Groceries', isActive: true },
    { vendorId: vendors[0]._id, name: 'Whole Wheat Atta 10kg', description: 'Stone ground whole wheat flour', price: 420, stock: 45, category: 'Groceries', isActive: true },
    { vendorId: vendors[0]._id, name: 'Amul Butter 500g', description: 'Pasteurised table butter', price: 260, stock: 30, category: 'Groceries', isActive: true },

    // Electronics
    { vendorId: vendors[1]._id, name: 'USB-C Charging Cable 2m', description: 'Fast charge 65W braided cable', price: 349, stock: 200, category: 'Electronics', isActive: true },
    { vendorId: vendors[1]._id, name: 'Wireless Earbuds', description: 'True wireless with 24hr battery', price: 1299, stock: 40, category: 'Electronics', isActive: true },
    { vendorId: vendors[1]._id, name: 'Power Bank 20000mAh', description: 'Dual USB fast charge power bank', price: 1599, stock: 25, category: 'Electronics', isActive: true },
    { vendorId: vendors[1]._id, name: 'LED Desk Lamp', description: 'Adjustable brightness, eye care', price: 799, stock: 35, category: 'Electronics', isActive: true },
    { vendorId: vendors[1]._id, name: 'Bluetooth Speaker', description: 'Portable waterproof speaker', price: 1899, stock: 18, category: 'Electronics', isActive: true },

    // Pharmacy
    { vendorId: vendors[2]._id, name: 'Paracetamol 500mg (10 tabs)', description: 'Fever and pain relief', price: 22, stock: 500, category: 'Pharmacy', isActive: true },
    { vendorId: vendors[2]._id, name: 'Vitamin C 1000mg (30 tabs)', description: 'Immunity booster supplement', price: 299, stock: 150, category: 'Pharmacy', isActive: true },
    { vendorId: vendors[2]._id, name: 'Hand Sanitizer 500ml', description: '70% isopropyl alcohol gel', price: 149, stock: 200, category: 'Pharmacy', isActive: true },
    { vendorId: vendors[2]._id, name: 'Digital Thermometer', description: 'Fast read oral thermometer', price: 349, stock: 60, category: 'Pharmacy', isActive: true },
    { vendorId: vendors[2]._id, name: 'Bandage Roll 5cm', description: 'Sterile cotton bandage', price: 45, stock: 300, category: 'Pharmacy', isActive: true },

    // Hardware
    { vendorId: vendors[3]._id, name: 'Drill Machine 500W', description: 'Corded drill with 13mm chuck', price: 2499, stock: 15, category: 'Hardware', isActive: true },
    { vendorId: vendors[3]._id, name: 'Screwdriver Set (12pc)', description: 'Magnetic tip precision set', price: 399, stock: 50, category: 'Hardware', isActive: true },
    { vendorId: vendors[3]._id, name: 'PVC Pipe 1 inch (3m)', description: 'ISI marked pressure pipe', price: 180, stock: 100, category: 'Hardware', isActive: true },
    { vendorId: vendors[3]._id, name: 'Wall Putty 5kg', description: 'White cement based putty', price: 320, stock: 40, category: 'Hardware', isActive: true },
    { vendorId: vendors[3]._id, name: 'Measuring Tape 5m', description: 'Auto-lock steel tape', price: 199, stock: 75, category: 'Hardware', isActive: true },

    // Clothing
    { vendorId: vendors[4]._id, name: 'Cotton Kurta (Men)', description: 'Breathable summer kurta', price: 699, stock: 60, category: 'Clothing', isActive: true },
    { vendorId: vendors[4]._id, name: 'Linen Shirt (Men)', description: 'Casual slim fit linen shirt', price: 899, stock: 45, category: 'Clothing', isActive: true },
    { vendorId: vendors[4]._id, name: 'Salwar Kameez Set (Women)', description: 'Printed cotton set', price: 1199, stock: 30, category: 'Clothing', isActive: true },
    { vendorId: vendors[4]._id, name: 'Denim Jeans (Unisex)', description: 'Slim fit stretch denim', price: 1499, stock: 40, category: 'Clothing', isActive: true },
    { vendorId: vendors[4]._id, name: 'Cotton Socks Pack (6 pairs)', description: 'Ankle length everyday socks', price: 299, stock: 120, category: 'Clothing', isActive: true },
  ]);
  console.log('Seeded 25 products across 5 categories');

  // --- Create Service Provider Users ---
  const providerUsers = await User.insertMany([
    { name: 'Suresh Plumbing', email: 'suresh@locallink.com', password: await bcrypt.hash('password123', 10), role: UserRole.SERVICE_PROVIDER },
    { name: 'Amit Electricals', email: 'amit@locallink.com', password: await bcrypt.hash('password123', 10), role: UserRole.SERVICE_PROVIDER },
    { name: 'CleanPro Services', email: 'cleanpro@locallink.com', password: await bcrypt.hash('password123', 10), role: UserRole.SERVICE_PROVIDER },
    { name: 'ColorCraft Painters', email: 'colorcraft@locallink.com', password: await bcrypt.hash('password123', 10), role: UserRole.SERVICE_PROVIDER },
    { name: 'GreenThumb Gardening', email: 'greenthumb@locallink.com', password: await bcrypt.hash('password123', 10), role: UserRole.SERVICE_PROVIDER },
  ]);

  // --- Create Service Provider Profiles ---
  const providers = await ServiceProvider.insertMany([
    { userId: providerUsers[0]._id, expertiseArea: 'Plumbing', yearsExperience: 8, verificationStatus: VerificationStatus.VERIFIED, averageRating: 4.7, totalReviews: 134 },
    { userId: providerUsers[1]._id, expertiseArea: 'Electrical', yearsExperience: 12, verificationStatus: VerificationStatus.VERIFIED, averageRating: 4.8, totalReviews: 210 },
    { userId: providerUsers[2]._id, expertiseArea: 'Cleaning', yearsExperience: 5, verificationStatus: VerificationStatus.VERIFIED, averageRating: 4.5, totalReviews: 89 },
    { userId: providerUsers[3]._id, expertiseArea: 'Painting', yearsExperience: 10, verificationStatus: VerificationStatus.VERIFIED, averageRating: 4.6, totalReviews: 67 },
    { userId: providerUsers[4]._id, expertiseArea: 'Gardening', yearsExperience: 6, verificationStatus: VerificationStatus.VERIFIED, averageRating: 4.4, totalReviews: 42 },
  ]);

  // --- Create Services ---
  await Service.insertMany([
    // Plumbing
    { providerId: providers[0]._id, title: 'Tap & Faucet Repair', description: 'Fix leaking taps and faucets', basePrice: 299, durationEst: '1 hour', category: 'Plumbing', allowsSameDay: true, isActive: true },
    { providerId: providers[0]._id, title: 'Pipe Leakage Fix', description: 'Detect and repair pipe leaks', basePrice: 499, durationEst: '2 hours', category: 'Plumbing', allowsSameDay: true, isActive: true },
    { providerId: providers[0]._id, title: 'Bathroom Fitting Installation', description: 'Full bathroom fixture setup', basePrice: 1499, durationEst: '4 hours', category: 'Plumbing', allowsSameDay: false, isActive: true },

    // Electrical
    { providerId: providers[1]._id, title: 'Switch & Socket Repair', description: 'Replace faulty switches and sockets', basePrice: 249, durationEst: '1 hour', category: 'Electrical', allowsSameDay: true, isActive: true },
    { providerId: providers[1]._id, title: 'Fan Installation', description: 'Ceiling or wall fan fitting', basePrice: 399, durationEst: '1 hour', category: 'Electrical', allowsSameDay: true, isActive: true },
    { providerId: providers[1]._id, title: 'Full Home Wiring Check', description: 'Safety audit of all wiring', basePrice: 1299, durationEst: '3 hours', category: 'Electrical', allowsSameDay: false, isActive: true },

    // Cleaning
    { providerId: providers[2]._id, title: 'Home Deep Clean (2BHK)', description: 'Full deep cleaning of 2BHK flat', basePrice: 1199, durationEst: '4 hours', category: 'Cleaning', allowsSameDay: false, isActive: true },
    { providerId: providers[2]._id, title: 'Kitchen Cleaning', description: 'Chimney, stove and cabinet clean', basePrice: 599, durationEst: '2 hours', category: 'Cleaning', allowsSameDay: true, isActive: true },
    { providerId: providers[2]._id, title: 'Sofa & Carpet Cleaning', description: 'Steam clean upholstery', basePrice: 799, durationEst: '2 hours', category: 'Cleaning', allowsSameDay: false, isActive: true },

    // Painting
    { providerId: providers[3]._id, title: 'Room Painting (1 room)', description: 'Wall prep and 2 coats paint', basePrice: 2499, durationEst: '1 day', category: 'Painting', allowsSameDay: false, isActive: true },
    { providerId: providers[3]._id, title: 'Wall Putty & Primer', description: 'Surface prep before painting', basePrice: 1299, durationEst: '4 hours', category: 'Painting', allowsSameDay: false, isActive: true },

    // Gardening
    { providerId: providers[4]._id, title: 'Garden Maintenance', description: 'Trimming, weeding and watering', basePrice: 499, durationEst: '2 hours', category: 'Gardening', allowsSameDay: true, isActive: true },
    { providerId: providers[4]._id, title: 'Plant Repotting', description: 'Repot and fertilise indoor plants', basePrice: 299, durationEst: '1 hour', category: 'Gardening', allowsSameDay: true, isActive: true },
  ]);
  console.log('Seeded 13 services across 5 categories');

  // --- Create a demo customer ---
  await User.create({
    name: 'Demo Customer',
    email: 'customer@locallink.com',
    password: await bcrypt.hash('password123', 10),
    role: UserRole.CUSTOMER,
  });

  // --- Create admin ---
  await User.create({
    name: 'Admin',
    email: 'admin@locallink.com',
    password: await bcrypt.hash('password123', 10),
    role: UserRole.ADMIN,
  });

  console.log('\nSeed complete. Demo accounts:');
  console.log('  Customer  → customer@locallink.com / password123');
  console.log('  Vendor    → ravi@locallink.com / password123');
  console.log('  Provider  → suresh@locallink.com / password123');
  console.log('  Admin     → admin@locallink.com / password123');

  await mongoose.disconnect();
  process.exit(0);
};

seed().catch(err => { console.error(err); process.exit(1); });
