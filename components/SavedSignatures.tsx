/* eslint-disable @next/next/no-img-element */
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Eye, Calendar, User } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface SavedSignature {
  _id: string;
  signatureData: string;
  personalDetails: {
    fullName: string;
    organization?: string;
    designation?: string;
    email: string;
  };
  createdAt: string;
  metadata: {
    timestamp: string;
    mode: string;
  };
}

interface SavedSignaturesProps {
  // Component is now view-only, for display purposes
}

export default function SavedSignatures({}: SavedSignaturesProps) {
  const [signatures, setSignatures] = useState<SavedSignature[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [selectedSignature, setSelectedSignature] = useState<SavedSignature | null>(null);
  const { token, isAuthenticated } = useAuth();

  const fetchSignatures = async () => {
    if (!isAuthenticated || !token) {
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/signatures/list', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch signatures');
      }

      setSignatures(data.signatures || []);
    } catch (err: any) {
      setError(err.message || 'Failed to load signatures');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSignatures();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, token]);

  const handleDelete = async (signatureId: string) => {
    try {
      const response = await fetch('/api/signatures/delete', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ signatureId }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete signature');
      }

      // Refresh the list
      setSignatures(signatures.filter(sig => sig._id !== signatureId));
      setDeleteId(null);
    } catch (err: any) {
      setError(err.message || 'Failed to delete signature');
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  if (loading) {
    return (
      <Card className="shadow-xl backdrop-blur-sm bg-card/95">
        <CardHeader>
          <CardTitle className="text-2xl">My Signatures</CardTitle>
          <CardDescription>Loading your saved signatures...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-xl backdrop-blur-sm bg-card/95">
      <CardHeader>
        <CardTitle className="text-2xl">My Signatures</CardTitle>
        <CardDescription>
          {signatures.length} signature{signatures.length !== 1 ? 's' : ''} saved
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {signatures.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>No signatures saved yet.</p>
            <p className="text-sm mt-2">Create your first signature above!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            <AnimatePresence>
              {signatures.map((signature, index) => (
                <motion.div
                  key={signature._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ delay: index * 0.1 }}
                  className="border rounded-lg p-4 hover:shadow-md transition-shadow bg-background"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-32 h-20 bg-white border rounded overflow-hidden flex items-center justify-center">
                      <img
                        src={signature.signatureData}
                        alt="Signature"
                        className="max-w-full max-h-full object-contain"
                      />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold text-lg flex items-center gap-2">
                            <User className="w-4 h-4" />
                            {signature.personalDetails.fullName}
                          </h3>
                          {signature.personalDetails.designation && signature.personalDetails.organization && (
                            <p className="text-sm text-muted-foreground">
                              {signature.personalDetails.designation} at {signature.personalDetails.organization}
                            </p>
                          )}
                          <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                            <Calendar className="w-3 h-3" />
                            {new Date(signature.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => setSelectedSignature(signature)}
                          aria-label="View signature"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                      </motion.div>
                      <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => setDeleteId(signature._id)}
                          className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
                          aria-label="Delete signature"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </motion.div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your signature.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => deleteId && handleDelete(deleteId)}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* View Signature Dialog */}
        <AlertDialog open={selectedSignature !== null} onOpenChange={() => setSelectedSignature(null)}>
          <AlertDialogContent className="max-w-2xl">
            <AlertDialogHeader>
              <AlertDialogTitle>Signature Details</AlertDialogTitle>
              <AlertDialogDescription asChild>
                <div className="space-y-4 text-left">
                  {selectedSignature && (
                    <>
                      <div className="bg-white border rounded-lg p-4 flex items-center justify-center">
                        <img
                          src={selectedSignature.signatureData}
                          alt="Signature"
                          className="max-w-full max-h-64 object-contain"
                        />
                      </div>
                      <div className="space-y-2 text-sm">
                        <p><strong>Name:</strong> {selectedSignature.personalDetails.fullName}</p>
                        <p><strong>Email:</strong> {selectedSignature.personalDetails.email}</p>
                        {selectedSignature.personalDetails.organization && (
                          <p><strong>Organization:</strong> {selectedSignature.personalDetails.organization}</p>
                        )}
                        {selectedSignature.personalDetails.designation && (
                          <p><strong>Designation:</strong> {selectedSignature.personalDetails.designation}</p>
                        )}
                        <p><strong>Created:</strong> {new Date(selectedSignature.createdAt).toLocaleString()}</p>
                        <p><strong>Mode:</strong> {selectedSignature.metadata.mode}</p>
                      </div>
                    </>
                  )}
                </div>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Close</AlertDialogCancel>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardContent>
    </Card>
  );
}
