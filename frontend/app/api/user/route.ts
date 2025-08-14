// backend/api/users/route.ts (Next.js App Router)
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Database schema interfaces
interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  dateOfBirth: string;
  language: 'en' | 'de';
  theme: 'light' | 'dark' | 'auto';
  passwordHash: string;
  createdAt: Date;
  updatedAt: Date;
}

interface SecuritySettings {
  userId: string;
  twoFactorEnabled: boolean;
  emailNotifications: boolean;
  smsNotifications: boolean;
  loginAlerts: boolean;
  transactionAlerts: boolean;
  passwordLastChanged: Date;
  trustedDevices: TrustedDevice[];
}

interface TrustedDevice {
  id: string;
  name: string;
  lastUsed: Date;
  deviceFingerprint: string;
}

interface NotificationSettings {
  userId: string;
  email: boolean;
  sms: boolean;
  push: boolean;
  transactionAlerts: boolean;
  marketingEmails: boolean;
  securityAlerts: boolean;
  monthlyStatements: boolean;
}

// Mock database (replace with real database)
let users: User[] = [
  {
    id: 'user-1',
    firstName: 'Celestina',
    lastName: 'White',
    email: 'celestina.white@dkb.de',
    phone: '+49 30 120 300 0',
    address: 'Taubenstraße 7-9, 10117 Berlin, Germany',
    dateOfBirth: '1985-06-15',
    language: 'en',
    theme: 'light',
    passwordHash: '$2a$10$hashedpassword', // bcrypt hash
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

let securitySettings: SecuritySettings[] = [
  {
    userId: 'user-1',
    twoFactorEnabled: true,
    emailNotifications: true,
    smsNotifications: false,
    loginAlerts: true,
    transactionAlerts: true,
    passwordLastChanged: new Date('2024-07-15'),
    trustedDevices: [
      { id: '1', name: 'iPhone 15 Pro', lastUsed: new Date(), deviceFingerprint: 'device1' },
      { id: '2', name: 'MacBook Pro', lastUsed: new Date(), deviceFingerprint: 'device2' }
    ]
  }
];

let notificationSettings: NotificationSettings[] = [
  {
    userId: 'user-1',
    email: true,
    sms: false,
    push: true,
    transactionAlerts: true,
    marketingEmails: false,
    securityAlerts: true,
    monthlyStatements: true
  }
];

// Utility functions
function verifyToken(request: NextRequest): string | null {
  const authHeader = request.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) return null;
  
  const token = authHeader.substring(7);
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret') as { userId: string };
    return decoded.userId;
  } catch {
    return null;
  }
}

function findUser(userId: string): User | undefined {
  return users.find(u => u.id === userId);
}

// GET /api/users - Get user profile
export async function GET(request: NextRequest) {
  const userId = verifyToken(request);
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const user = findUser(userId);
  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  const security = securitySettings.find(s => s.userId === userId);
  const notifications = notificationSettings.find(n => n.userId === userId);

  // Remove password hash from response
  const { passwordHash, ...userWithoutPassword } = user;

  return NextResponse.json({
    user: userWithoutPassword,
    security,
    notifications
  });
}

// PUT /api/users/profile - Update user profile
export async function PUT(request: NextRequest) {
  const userId = verifyToken(request);
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { firstName, lastName, email, phone, address, dateOfBirth, language, theme } = body;

    // Validation
    if (!firstName || !lastName || !email) {
      return NextResponse.json({ error: 'Required fields missing' }, { status: 400 });
    }

    if (!email.includes('@')) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 });
    }

    // Find and update user
    const userIndex = users.findIndex(u => u.id === userId);
    if (userIndex === -1) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    users[userIndex] = {
      ...users[userIndex],
      firstName,
      lastName,
      email,
      phone,
      address,
      dateOfBirth,
      language,
      theme,
      updatedAt: new Date()
    };

    const { passwordHash, ...userWithoutPassword } = users[userIndex];

    return NextResponse.json({
      success: true,
      user: userWithoutPassword
    });

  } catch (error) {
    console.error('Profile update error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// backend/api/users/password/route.ts - Change password
export async function PATCH(request: NextRequest) {
  const userId = verifyToken(request);
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { currentPassword, newPassword } = await request.json();

    // Validation
    if (!currentPassword || !newPassword) {
      return NextResponse.json({ error: 'Current and new password required' }, { status: 400 });
    }

    if (newPassword.length < 8) {
      return NextResponse.json({ error: 'Password must be at least 8 characters' }, { status: 400 });
    }

    const user = findUser(userId);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Verify current password
    const isValidPassword = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!isValidPassword) {
      return NextResponse.json({ error: 'Current password is incorrect' }, { status: 400 });
    }

    // Hash new password and update
    const newPasswordHash = await bcrypt.hash(newPassword, 10);
    const userIndex = users.findIndex(u => u.id === userId);
    users[userIndex] = {
      ...users[userIndex],
      passwordHash: newPasswordHash,
      updatedAt: new Date()
    };

    // Update security settings
    const securityIndex = securitySettings.findIndex(s => s.userId === userId);
    if (securityIndex !== -1) {
      securitySettings[securityIndex] = {
        ...securitySettings[securityIndex],
        passwordLastChanged: new Date()
      };
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Password change error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// backend/api/users/security/route.ts - Update security settings
export async function POST(request: NextRequest) {
  const userId = verifyToken(request);
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { twoFactorEnabled, emailNotifications, smsNotifications, loginAlerts, transactionAlerts } = body;

    const securityIndex = securitySettings.findIndex(s => s.userId === userId);
    
    if (securityIndex === -1) {
      // Create new security settings
      securitySettings.push({
        userId,
        twoFactorEnabled: twoFactorEnabled ?? false,
        emailNotifications: emailNotifications ?? true,
        smsNotifications: smsNotifications ?? false,
        loginAlerts: loginAlerts ?? true,
        transactionAlerts: transactionAlerts ?? true,
        passwordLastChanged: new Date(),
        trustedDevices: []
      });
    } else {
      // Update existing settings
      securitySettings[securityIndex] = {
        ...securitySettings[securityIndex],
        twoFactorEnabled,
        emailNotifications,
        smsNotifications,
        loginAlerts,
        transactionAlerts
      };
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Security settings update error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// backend/api/users/notifications/route.ts - Update notification settings
export async function PUT(request: NextRequest) {
  const userId = verifyToken(request);
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { email, sms, push, transactionAlerts, marketingEmails, securityAlerts, monthlyStatements } = body;

    const notificationIndex = notificationSettings.findIndex(n => n.userId === userId);
    
    if (notificationIndex === -1) {
      // Create new notification settings
      notificationSettings.push({
        userId,
        email: email ?? true,
        sms: sms ?? false,
        push: push ?? true,
        transactionAlerts: transactionAlerts ?? true,
        marketingEmails: marketingEmails ?? false,
        securityAlerts: securityAlerts ?? true,
        monthlyStatements: monthlyStatements ?? true
      });
    } else {
      // Update existing settings
      notificationSettings[notificationIndex] = {
        userId,
        email,
        sms,
        push,
        transactionAlerts,
        marketingEmails,
        securityAlerts,
        monthlyStatements
      };
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Notification settings update error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// backend/api/users/trusted-devices/route.ts - Remove trusted device
export async function DELETE(request: NextRequest) {
  const userId = verifyToken(request);
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const url = new URL(request.url);
    const deviceId = url.searchParams.get('deviceId');

    if (!deviceId) {
      return NextResponse.json({ error: 'Device ID required' }, { status: 400 });
    }

    const securityIndex = securitySettings.findIndex(s => s.userId === userId);
    if (securityIndex === -1) {
      return NextResponse.json({ error: 'Security settings not found' }, { status: 404 });
    }

    securitySettings[securityIndex] = {
      ...securitySettings[securityIndex],
      trustedDevices: securitySettings[securityIndex].trustedDevices.filter(device => device.id !== deviceId)
    };

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Remove trusted device error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// backend/api/users/export/route.ts - Export user data
export async function GET(request: NextRequest) {
  const userId = verifyToken(request);
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const user = findUser(userId);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const security = securitySettings.find(s => s.userId === userId);
    const notifications = notificationSettings.find(n => n.userId === userId);

    const { passwordHash, ...userWithoutPassword } = user;

    const exportData = {
      user: userWithoutPassword,
      security: security ? { ...security, trustedDevices: security.trustedDevices.length } : null,
      notifications,
      exportDate: new Date().toISOString(),
      exportedBy: userId
    };

    return NextResponse.json(exportData);

  } catch (error) {
    console.error('Data export error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
