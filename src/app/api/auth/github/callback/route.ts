import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code");
  const token = req.cookies.get("accessToken")?.value || "";
  if (!code) {
    return NextResponse.redirect(`http://localhost:3000/profile?error=OAuth failed`);
  }

  try {
    const tokenRes = await axios.post(
      `https://github.com/login/oauth/access_token`,
      {
        client_id: process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID,
        client_secret: process.env.NEXT_PUBLIC_GITHUB_CLIENT_SECRET,
        code,
      },
      {
        headers: {
          Accept: "application/json",
        },
      }
    );

    const { access_token } = tokenRes.data;

    const userRes = await axios.get("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    const emailRes = await axios.get("https://api.github.com/user/emails", {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    type GithubEmail = { email: string; primary: boolean; verified: boolean; visibility: string | null };
    const primaryEmail = (emailRes.data as GithubEmail[]).find((e) => e.primary)?.email;

    const providerAccountId = userRes.data.id.toString();
    const name = userRes.data.name;
    const image = userRes.data.avatar_url;
    const githubUsername = userRes.data.login;

    await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URI}/api/auth/social/github`, {
      email: primaryEmail,
      provider: "github",
      providerAccountId,
      accessToken: access_token,
      githubToken: access_token, 
      image,
      name,
      githubUsername
    },  {
      headers: {
        Authorization: `Bearer ${token}`
      }
  });

    return NextResponse.redirect(`http://localhost:3000/dashboard`);
  } catch (error) {
    console.error("OAuth Callback Error:", error);
    return NextResponse.redirect(`http://localhost:3000/profile?error=OAuth failed`);
  }
}
