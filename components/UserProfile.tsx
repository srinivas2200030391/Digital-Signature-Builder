'use client';

import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { User, Mail, Calendar, Shield } from 'lucide-react';

export default function UserProfile() {
  const { user } = useAuth();

  if (!user) {
    return null;
  }

  const profileItems = [
    {
      icon: User,
      label: 'Name',
      value: user.name,
    },
    {
      icon: Mail,
      label: 'Email',
      value: user.email,
    },
    {
      icon: Calendar,
      label: 'Member Since',
      value: new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
    },
    {
      icon: Shield,
      label: 'Account Status',
      value: 'Active',
    },
  ];

  return (
    <Card className="shadow-xl backdrop-blur-sm bg-card/95">
      <CardHeader>
        <CardTitle className="text-2xl">My Profile</CardTitle>
        <CardDescription>Your account information and settings</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Profile Avatar */}
        <div className="flex justify-center mb-6">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="w-24 h-24 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center"
          >
            <span className="text-white font-bold text-4xl">
              {user.name?.charAt(0).toUpperCase()}
            </span>
          </motion.div>
        </div>

        {/* Profile Information */}
        <div className="space-y-4">
          {profileItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center space-x-4 p-4 bg-muted rounded-lg"
              >
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                </div>
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">{item.label}</p>
                  <p className="text-base font-medium">{item.value}</p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Additional Info */}
        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <p className="text-sm text-blue-800 dark:text-blue-200">
            🔐 Your account is secured with industry-standard encryption and authentication.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
