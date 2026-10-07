import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "./firebase";

export type SocialLinks = {
  facebook: string;
  instagram: string;
  youtube: string;
  telegram: string;
};

export const DEFAULT_SOCIAL_LINKS: SocialLinks = {
  facebook: "https://www.facebook.com/",
  instagram: "https://www.instagram.com/",
  youtube: "https://www.youtube.com/",
  telegram: "https://t.me/",
};

export async function loadSocialLinks(): Promise<SocialLinks> {
  try {
    const snap = await getDoc(doc(db, "settings", "social"));
    if (!snap.exists()) return DEFAULT_SOCIAL_LINKS;
    const data = snap.data() as Partial<SocialLinks>;
    return { ...DEFAULT_SOCIAL_LINKS, ...data };
  } catch {
    return DEFAULT_SOCIAL_LINKS;
  }
}

export async function saveSocialLinks(links: SocialLinks): Promise<void> {
  await setDoc(doc(db, "settings", "social"), links, { merge: true });
}
