import type { AvatarConfig } from "@/lib/avatar";

export type UserRole = "admin" | "member";
export type MembershipStatus = "none" | "pending" | "active" | "rejected" | "suspended";
export type ModerationStatus = "pending" | "approved" | "rejected";
export type ServiceType = "avaliacao" | "acompanhamento" | "ambos";

export interface UserEntity {
  id: string;
  name: string;
  email: string;
  role: UserRole | string;
  avatar_config?: Partial<AvatarConfig> | null;
  neurodivergences?: string[];
  manifesto?: string;
  has_medical_report?: string;
  created_at?: string;
}

export interface MembershipEntity {
  id: string;
  user_id?: string | null;
  name: string;
  email: string;
  profile: string;
  city_state: string;
  neurodivergences: string[];
  avatar_config: Partial<AvatarConfig> | null;
  manifesto: string;
  has_medical_report: string;
  show_in_directory: boolean;
  accepted_code: boolean;
  membership_status: MembershipStatus | string;
  member_number: string;
  terms_version?: string;
  accepted_at?: string;
  approved_at?: string;
  approved_by?: string;
  created_at?: string;
}

export interface PartnerProfessionalEntity {
  id: string;
  name: string;
  email?: string;
  registry_code: string;
  specialty: string;
  approach: string;
  region?: string;
  state?: string;
  city?: string;
  city_state: string;
  online_available: boolean;
  whatsapp?: string;
  social_url?: string;
  other_qualifications?: string;
  service_type?: ServiceType | string;
  bio: string;
  contact_url: string;
  status?: ModerationStatus | string;
}

export interface EventEntity {
  id: string;
  title: string;
  description: string;
  event_date: string;
  format: string;
  image_url?: string;
  event_link: string;
  active?: boolean;
}

export interface CommunitySubmissionEntity {
  id: string;
  author_name: string;
  author_avatar: Partial<AvatarConfig> | null;
  author_neurodivergences: string[];
  kind: "relato" | "arte" | "link" | string;
  title: string;
  content: string;
  external_url: string;
  image_url: string;
  credits: string;
  status?: ModerationStatus | string;
  created_at: string;
}

export interface FinancialExpenseEntity {
  id: string;
  category: string;
  description: string;
  amount_cents: number;
  reference_date: string;
}
