import { scalekit } from "@/lib/scalekit";
import { cookies } from "next/headers";

export const getUserSession = async () => {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("access_token")?.value;

    if (!token) return null;

    const res: any = await scalekit.validateToken(token);
    const user = await scalekit.user.getUser(res.sub);

    return user;
  } catch (error) {
    console.log(error);
    return null;
  }
};
