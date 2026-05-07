'use client';

// 1. IMMEDIATE POLYFILL (Must be first)
import { Buffer } from 'buffer';
if (typeof window !== 'undefined') {
  window.Buffer = window.Buffer || Buffer;
}

import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { useConnection, useWallet, useAnchorWallet } from '@solana/wallet-adapter-react';
import { Program, AnchorProvider, utils } from '@coral-xyz/anchor';
import { PublicKey, SystemProgram } from '@solana/web3.js';
import { useToast } from './ToastContext';

const PROGRAM_ID = new PublicKey('DUeqKHA2PZ3y4QBmJJstxYkWLZR15rLB9jxPNN12H3FH');

const IDL_BASE = {
  "address": "DUeqKHA2PZ3y4QBmJJstxYkWLZR15rLB9jxPNN12H3FH",
  "metadata": { "name": "zaynab", "version": "0.1.0", "spec": "0.1.0" },
  "instructions": [
    { "name": "initializeUser", "discriminator": [ 111, 17, 185, 250, 60, 122, 38, 254 ], "args": [ { "name": "name", "type": "string" } ], "accounts": [ { "name": "userStats", "writable": true }, { "name": "user", "writable": true, "signer": true }, { "name": "systemProgram", "address": "11111111111111111111111111111111" } ] },
    { "name": "updateUser", "discriminator": [ 9, 2, 160, 169, 118, 12, 207, 84 ], "args": [ { "name": "name", "type": "string" } ], "accounts": [ { "name": "userStats", "writable": true }, { "name": "owner", "writable": true, "signer": true } ] },
    { "name": "submitAssignment", "discriminator": [ 224, 30, 155, 25, 219, 208, 157, 86 ], "args": [ { "name": "contentUrl", "type": "string" } ], "accounts": [ { "name": "assignment", "writable": true }, { "name": "user", "writable": true, "signer": true }, { "name": "systemProgram", "address": "11111111111111111111111111111111" } ] },
    { "name": "submitReview", "discriminator": [ 106, 30, 50, 83, 89, 46, 213, 239 ], "args": [ { "name": "grade", "type": "u8" }, { "name": "comment", "type": "string" } ], "accounts": [ { "name": "review", "writable": true }, { "name": "assignment", "writable": true }, { "name": "userStats", "writable": true }, { "name": "user", "writable": true, "signer": true }, { "name": "systemProgram", "address": "11111111111111111111111111111111" } ] },
    { "name": "createChannel", "discriminator": [ 37, 105, 253, 99, 87, 46, 223, 20 ], "args": [ { "name": "name", "type": "string" } ], "accounts": [ { "name": "channel", "writable": true }, { "name": "user", "writable": true, "signer": true }, { "name": "systemProgram", "address": "11111111111111111111111111111111" } ] },
    { "name": "sendInvite", "discriminator": [ 56, 0, 46, 108, 195, 182, 195, 69 ], "args": [], "accounts": [ { "name": "invite", "writable": true }, { "name": "receiver", "writable": false }, { "name": "assignment", "writable": false }, { "name": "user", "writable": true, "signer": true }, { "name": "systemProgram", "address": "11111111111111111111111111111111" } ] },
    { "name": "finalizeAssignment", "discriminator": [ 162, 229, 48, 42, 36, 169, 105, 120 ], "args": [], "accounts": [ { "name": "assignment", "writable": true }, { "name": "student", "writable": true, "signer": true } ] }
  ],
  "accounts": [
    { "name": "userStats", "discriminator": [ 176, 223, 136, 27, 122, 79, 32, 227 ], "type": "UserStats" },
    { "name": "assignment", "discriminator": [ 106, 201, 110, 51, 89, 170, 73, 31 ], "type": "Assignment" },
    { "name": "review", "discriminator": [ 124, 63, 203, 215, 226, 30, 222, 15 ], "type": "Review" },
    { "name": "channel", "discriminator": [ 49, 159, 99, 106, 220, 87, 219, 88 ], "type": "Channel" },
    { "name": "invite", "discriminator": [ 230, 17, 253, 74, 50, 78, 85, 101 ], "type": "Invite" }
  ],
  "types": [
    { "name": "UserStats", "type": { "kind": "struct", "fields": [ { "name": "owner", "type": "pubkey" }, { "name": "name", "type": "string" }, { "name": "reputation", "type": "u64" }, { "name": "completedAssignments", "type": "u32" }, { "name": "completedReviews", "type": "u32" }, { "name": "bump", "type": "u8" } ] } },
    { "name": "Assignment", "type": { "kind": "struct", "fields": [ { "name": "student", "type": "pubkey" }, { "name": "contentUrl", "type": "string" }, { "name": "status", "type": { "defined": { "name": "AssignmentStatus" } } }, { "name": "averageGrade", "type": "u8" }, { "name": "reviewCount", "type": "u8" }, { "name": "totalGrade", "type": "u32" }, { "name": "nftMinted", "type": "bool" }, { "name": "bump", "type": "u8" } ] } },
    { "name": "Review", "type": { "kind": "struct", "fields": [ { "name": "reviewer", "type": "pubkey" }, { "name": "assignment", "type": "pubkey" }, { "name": "grade", "type": "u8" }, { "name": "comment", "type": "string" }, { "name": "bump", "type": "u8" } ] } },
    { "name": "Channel", "type": { "kind": "struct", "fields": [ { "name": "creator", "type": "pubkey" }, { "name": "name", "type": "string" }, { "name": "memberCount", "type": "u32" }, { "name": "bump", "type": "u8" } ] } },
    { "name": "Invite", "type": { "kind": "struct", "fields": [ { "name": "sender", "type": "pubkey" }, { "name": "receiver", "type": "pubkey" }, { "name": "assignment", "type": "pubkey" }, { "name": "status", "type": { "defined": { "name": "InviteStatus" } } }, { "name": "bump", "type": "u8" } ] } },
    { "name": "AssignmentStatus", "type": { "kind": "enum", "variants": [ { "name": "Submitted" }, { "name": "Finalized" } ] } },
    { "name": "InviteStatus", "type": { "kind": "enum", "variants": [ { "name": "Pending" }, { "name": "Accepted" }, { "name": "Rejected" } ] } }
  ],
  "errors": [
    { "code": 6000, "name": "AssignmentNotReady", "msg": "The assignment is not yet ready for finalization." },
    { "code": 6001, "name": "Unauthorized", "msg": "You are not authorized to perform this action." },
    { "code": 6002, "name": "InsufficientReputation", "msg": "Insufficient reputation to perform this action." },
    { "code": 6003, "name": "AssignmentAlreadyFinalized", "msg": "Assignment is already finalized." },
    { "code": 6004, "name": "InvalidGrade", "msg": "Invalid grade provided. Must be between 0 and 100." },
    { "code": 6005, "name": "ContentUrlTooLong", "msg": "Content URL is too long." },
    { "code": 6006, "name": "CommentTooLong", "msg": "Comment is too long." }
  ]
};

interface ZcgContextType {
  program: Program | null;
  userStats: any | null;
  assignments: any[];
  reviewQueue: any[];
  loading: boolean;
  submitAssignment: (url: string) => Promise<void>;
  submitReview: (assignmentPubKey: PublicKey, grade: number, comment: string) => Promise<void>;
  initializeUser: (name: string) => Promise<void>;
  updateUser: (name: string) => Promise<void>;
  createChannel: (name: string) => Promise<void>;
  sendInvite: (receiverPubKey: PublicKey, assignmentPubKey: PublicKey) => Promise<void>;
  requestAirdrop: () => Promise<void>;
  finalizeAssignment: (assignmentPubKey: PublicKey) => Promise<void>;
  refreshData: () => Promise<void>;
}

const ZcgContext = createContext<ZcgContextType | undefined>(undefined);

export function ZcgProvider({ children }: { children: React.ReactNode }) {
  const { connection } = useConnection();
  const { publicKey } = useWallet();
  const anchorWallet = useAnchorWallet();
  const { showToast, removeToast } = useToast();
  
  const [userStats, setUserStats] = useState<any | null>(null);
  const [assignments, setAssignments] = useState<any[]>([]);
  const [reviewQueue, setReviewQueue] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const provider = useMemo(() => {
    if (!anchorWallet) return null;
    return new AnchorProvider(connection, anchorWallet, AnchorProvider.defaultOptions());
  }, [connection, anchorWallet]);

  const program = useMemo(() => {
    if (!provider) return null;
    try {
      return new Program(IDL_BASE as any, provider);
    } catch (e) {
      console.error("ZAYNAB Program Init Error:", e);
      return null;
    }
  }, [provider]);

  const refreshData = useCallback(async () => {
    if (!publicKey || !program) return;
    
    try {
      const [userStatsPDA] = PublicKey.findProgramAddressSync(
        [Buffer.from("user-stats"), publicKey.toBuffer()],
        PROGRAM_ID
      );
      
      try {
        const scholar = await (program.account as any).userStats.fetch(userStatsPDA);
        setUserStats({
          ...scholar,
          reputation: scholar.reputation.toString(),
          completedAssignments: scholar.completedAssignments,
          completedReviews: scholar.completedReviews,
        });
      } catch (e) {
        setUserStats(null);
      }

      const assignmentsData = await (program.account as any).assignment.all();
      const assignmentsList = assignmentsData.map((item: any) => ({
        publicKey: item.publicKey,
        ...item.account,
        reviewCount: item.account.reviewCount.toString(),
        averageGrade: item.account.averageGrade.toString(),
        totalGrade: item.account.totalGrade.toString(),
      }));

      setAssignments(assignmentsList.filter(
        (item: any) => item.student.toString() === publicKey.toString()
      ));

      setReviewQueue(assignmentsList.filter(
        (item: any) => item.student.toString() !== publicKey.toString() && (item.status.submitted || item.status.Submitted)
      ));

    } catch (error) {
      console.error("Data Refresh Error:", error);
    }
  }, [publicKey, program]);

  useEffect(() => {
    refreshData();
    const interval = setInterval(refreshData, 5000);
    return () => clearInterval(interval);
  }, [refreshData]);

  const parseError = (error: any): string => {
    const errorString = error?.toString() || '';
    if (errorString.includes('6000')) return 'Assignment not yet ready for finalization.';
    if (errorString.includes('6001')) return 'Unauthorized: Only the student can finalize.';
    if (errorString.includes('6002')) return 'Insufficient reputation (Min. 50 required).';
    if (errorString.includes('6003')) return 'Assignment is already finalized.';
    if (errorString.includes('6004')) return 'Invalid grade (Must be 0-100).';
    if (errorString.includes('6005')) return 'URL is too long (Max 200).';
    if (errorString.includes('6006')) return 'Comment is too long (Max 100).';
    if (errorString.includes('User rejected')) return 'Cancelled by user.';
    return 'Action failed.';
  };

  const getHash = async (val: string) => {
    const encoder = new TextEncoder();
    const data = encoder.encode(val);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    return Buffer.from(hashBuffer);
  };

  const submitAssignment = async (rawUrl: string) => {
    if (!publicKey || !program) return;
    const url = rawUrl.trim();
    const loadingId = showToast('Publishing to ZAYNAB...', 'loading');
    try {
      const urlHash = await getHash(url);
      const [assignmentPDA] = PublicKey.findProgramAddressSync(
        [Buffer.from("assignment"), publicKey.toBuffer(), urlHash],
        PROGRAM_ID
      );
      
      await (program.methods as any).submitAssignment(url).accounts({
        assignment: assignmentPDA,
        user: publicKey,
        systemProgram: SystemProgram.programId,
      }).rpc();
      
      showToast('Assignment published!', 'success');
      await refreshData();
    } catch (error) {
      showToast(parseError(error), 'error');
    } finally {
      removeToast(loadingId);
    }
  };

  const submitReview = async (assignmentPubKey: PublicKey, grade: number, comment: string) => {
    if (!publicKey || !program) return;
    const loadingId = showToast('Submitting review...', 'loading');
    try {
      const [reviewPDA] = PublicKey.findProgramAddressSync(
        [Buffer.from("review"), publicKey.toBuffer(), assignmentPubKey.toBuffer()],
        PROGRAM_ID
      );
      const [userStatsPDA] = PublicKey.findProgramAddressSync(
        [Buffer.from("user-stats"), publicKey.toBuffer()],
        PROGRAM_ID
      );
      
      await (program.methods as any).submitReview(grade, comment).accounts({
        review: reviewPDA,
        assignment: assignmentPubKey,
        userStats: userStatsPDA,
        user: publicKey,
        systemProgram: SystemProgram.programId,
      }).rpc();
      
      showToast('Review recorded!', 'success');
      await refreshData();
    } catch (error) {
      showToast(parseError(error), 'error');
    } finally {
      removeToast(loadingId);
    }
  };

  const initializeUser = async (name: string) => {
    if (!publicKey || !program) return;
    const loadingId = showToast('Initializing Scholar...', 'loading');
    try {
      const [userStatsPDA] = PublicKey.findProgramAddressSync(
        [Buffer.from("user-stats"), publicKey.toBuffer()],
        PROGRAM_ID
      );
      await (program.methods as any).initializeUser(name).accounts({
        userStats: userStatsPDA,
        user: publicKey,
        systemProgram: SystemProgram.programId,
      }).rpc();
      
      showToast(`Welcome, ${name}!`, 'success');
      await refreshData();
    } catch (error) {
      showToast(parseError(error), 'error');
    } finally {
      removeToast(loadingId);
    }
  };

  const updateUser = async (name: string) => {
    if (!publicKey || !program) return;
    const loadingId = showToast('Updating profile...', 'loading');
    try {
      const [userStatsPDA] = PublicKey.findProgramAddressSync(
        [Buffer.from("user-stats"), publicKey.toBuffer()],
        PROGRAM_ID
      );
      await (program.methods as any).updateUser(name).accounts({
        userStats: userStatsPDA,
        owner: publicKey,
      }).rpc();
      
      showToast('Identity updated!', 'success');
      await refreshData();
    } catch (error) {
      showToast(parseError(error), 'error');
    } finally {
      removeToast(loadingId);
    }
  };

  const createChannel = async (name: string) => {
    if (!publicKey || !program) return;
    const loadingId = showToast('Creating research channel...', 'loading');
    try {
      const nameHash = await getHash(name);
      const [channelPDA] = PublicKey.findProgramAddressSync(
        [Buffer.from("channel"), nameHash],
        PROGRAM_ID
      );
      await (program.methods as any).createChannel(name).accounts({
        channel: channelPDA,
        user: publicKey,
        systemProgram: SystemProgram.programId,
      }).rpc();
      showToast(`Channel "${name}" established!`, 'success');
      await refreshData();
    } catch (error) {
      showToast(parseError(error), 'error');
    } finally {
      removeToast(loadingId);
    }
  };

  const sendInvite = async (receiverPubKey: PublicKey, assignmentPubKey: PublicKey) => {
    if (!publicKey || !program) return;
    const loadingId = showToast('Sending peer invitation...', 'loading');
    try {
      const [invitePDA] = PublicKey.findProgramAddressSync(
        [Buffer.from("invite"), publicKey.toBuffer(), receiverPubKey.toBuffer(), assignmentPubKey.toBuffer()],
        PROGRAM_ID
      );
      await (program.methods as any).sendInvite().accounts({
        invite: invitePDA,
        receiver: receiverPubKey,
        assignment: assignmentPubKey,
        user: publicKey,
        systemProgram: SystemProgram.programId,
      }).rpc();
      showToast('Invitation sent!', 'success');
    } catch (error) {
      showToast(parseError(error), 'error');
    } finally {
      removeToast(loadingId);
    }
  };

  const requestAirdrop = async () => {
    if (!publicKey) return;
    const loadingId = showToast('Requesting Airdrop...', 'loading');
    try {
      const signature = await connection.requestAirdrop(publicKey, 1000000000);
      await connection.confirmTransaction(signature);
      showToast('SOL received!', 'success');
    } catch (error) {
      showToast('Airdrop failed.', 'error');
    } finally {
      removeToast(loadingId);
    }
  };

  const finalizeAssignment = async (assignmentPubKey: PublicKey) => {
    if (!publicKey || !program) return;
    const loadingId = showToast('Finalizing...', 'loading');
    try {
      await (program.methods as any).finalizeAssignment().accounts({
        assignment: assignmentPubKey,
        student: publicKey,
      }).rpc();
      showToast('Finalized!', 'success');
      await refreshData();
    } catch (error) {
      showToast(parseError(error), 'error');
    } finally {
      removeToast(loadingId);
    }
  };

  const value = {
    program,
    userStats,
    assignments,
    reviewQueue,
    loading,
    submitAssignment,
    submitReview,
    initializeUser,
    updateUser,
    createChannel,
    sendInvite,
    requestAirdrop,
    finalizeAssignment,
    refreshData
  };

  return (
    <ZcgContext.Provider value={value}>
      {children}
    </ZcgContext.Provider>
  );
}

export function useZcgContext() {
  const context = useContext(ZcgContext);
  if (context === undefined) {
    throw new Error('useZcgContext must be used within a ZcgProvider');
  }
  return context;
}
