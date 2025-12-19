
export type UserRole = 'client' | 'admin';

export interface UserProfile {
  uid: string;
  email: string;
  fullName: string;
  role: UserRole;
  phoneNumber?: string;
  createdAt: number;
}

export type PolicyStatus = 'pending' | 'active' | 'expired' | 'rejected';
export type InsuranceType = 'Motor' | 'Health' | 'Life' | 'Travel';

export interface InsurancePolicy {
  id: string;
  userId: string;
  userName: string;
  type: InsuranceType;
  planName: string;
  premium: number;
  status: PolicyStatus;
  startDate: number;
  expiryDate: number;
  policyNumber?: string;
  createdAt: number;
}

export type ClaimStatus = 'under-review' | 'approved' | 'rejected' | 'paid';

export interface InsuranceClaim {
  id: string;
  policyId: string;
  userId: string;
  userName: string;
  amount: number;
  description: string;
  status: ClaimStatus;
  evidenceUrls: string[];
  createdAt: number;
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}
