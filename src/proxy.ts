import { NextRequest, NextResponse } from "next/server";
import { ENV } from "./lib/env";
import { getUserSession } from "./lib/getUserSession";

export async function proxy(request: NextRequest) {
  try {
    const user = await getUserSession();
    if (!user) return NextResponse.redirect(ENV.API_URI);
    return NextResponse.next();
  } catch (error) {
    console.log("Error from proxcy", error);
    return NextResponse.redirect(ENV.API_URI);
  }
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
