import { auth } from "@/lib/auth";
import { DEFAULT_AVATAR_CONFIG, type AvatarConfig } from "@/lib/avatar";
import { isDatabaseConfigured, query } from "@/lib/db";
import { AssocieSeClient, type InitialMemberProfile } from "./AssocieSeClient";

export const dynamic = "force-dynamic";

export default async function AssocieSePage() {
  const session = await auth();
  let initial: InitialMemberProfile = {
    isEditingExisting: false,
    name: session?.user?.name || "",
    email: session?.user?.email || "",
    profile: "Pessoa com AH/SD",
    cityState: "",
    hasMedicalReport: "nao_informado",
    showInDirectory: false,
    manifesto: "",
    avatarConfig: DEFAULT_AVATAR_CONFIG,
    neurodivergences: ["ahsd"],
  };

  if (session?.user?.email && isDatabaseConfigured()) {
    try {
      const email = session.user.email.toLowerCase();
      const [userRows, membershipRows] = await Promise.all([
        query<{
          name: string;
          email: string;
          avatar_config: Partial<AvatarConfig> | null;
          neurodivergences: string[];
          manifesto: string;
          has_medical_report: string;
        }>(
          "SELECT name, email, avatar_config, neurodivergences, manifesto, has_medical_report FROM users WHERE LOWER(email) = $1 LIMIT 1",
          [email]
        ),
        query<{
          profile: string;
          city_state: string;
          avatar_config: Partial<AvatarConfig> | null;
          neurodivergences: string[];
          manifesto: string;
          has_medical_report: string;
          show_in_directory: boolean;
        }>(
          "SELECT profile, city_state, avatar_config, neurodivergences, manifesto, has_medical_report, show_in_directory FROM memberships WHERE LOWER(email) = $1 ORDER BY created_at DESC LIMIT 1",
          [email]
        ),
      ]);

      const u = userRows[0];
      const m = membershipRows[0];
      const avatar = u?.avatar_config || m?.avatar_config;
      const neuro =
        (u?.neurodivergences?.length ? u.neurodivergences : m?.neurodivergences) || ["ahsd"];

      initial = {
        isEditingExisting: Boolean(avatar || m),
        name: u?.name || initial.name,
        email: u?.email || initial.email,
        profile: m?.profile || initial.profile,
        cityState: m?.city_state || "",
        hasMedicalReport: u?.has_medical_report || m?.has_medical_report || "nao_informado",
        showInDirectory: Boolean(m?.show_in_directory),
        manifesto: u?.manifesto || m?.manifesto || "",
        avatarConfig: avatar ? { ...DEFAULT_AVATAR_CONFIG, ...avatar } : DEFAULT_AVATAR_CONFIG,
        neurodivergences: neuro.length > 0 ? neuro : ["ahsd"],
      };
    } catch {
      // keep defaults
    }
  }

  return <AssocieSeClient initial={initial} />;
}
