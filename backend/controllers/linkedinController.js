// // controllers/linkedinController.js
// import axios from "axios";
// import jwt from "jsonwebtoken";
// import User from "../models/User.js";

// export async function linkedinOAuthStart(req, res) {
//   try {
//     const token = req.query.token;
//     if (!token) return res.status(401).json({ msg: "No token, auth denied" });

//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     const userId = decoded.id;

//     const clientId = process.env.LINKEDIN_CLIENT_ID;
//     const redirectUri = process.env.LINKEDIN_REDIRECT_URI;
//     const scope = "openid profile email w_member_social";
//     const state = userId;

//     const authUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&state=${state}&scope=${encodeURIComponent(scope)}`;

//     res.redirect(authUrl);
//   } catch (err) {
//     console.error("🔴 OAuth Start Error:", err.message);
//     return res.status(401).json({ msg: "Invalid token" });
//   }
// }

// export async function linkedinOAuthCallback(req, res) {
//   const { code, state } = req.query;

//   if (!code || !state) {
//     console.error("❌ Missing 'code' or 'state' in LinkedIn callback.");
//     return res.status(400).json({ error: "Missing code or state in callback." });
//   }

//   console.log("✅ LinkedIn Callback -> code:", code);
//   console.log("✅ LinkedIn Callback -> state:", state);
//   console.log("ℹ️ Redirect URI used:", process.env.LINKEDIN_REDIRECT_URI);

//   try {
//     const tokenRes = await axios.post(
//       "https://www.linkedin.com/oauth/v2/accessToken",
//       new URLSearchParams({
//         grant_type: "authorization_code",
//         code,
//         redirect_uri: process.env.LINKEDIN_REDIRECT_URI,
//         client_id: process.env.LINKEDIN_CLIENT_ID,
//         client_secret: process.env.LINKEDIN_CLIENT_SECRET,
//       }),
//       {
//         headers: {
//           "Content-Type": "application/x-www-form-urlencoded",
//         },
//       }
//     );

//     const accessToken = tokenRes.data.access_token;

//     if (!accessToken) {
//       console.error("❌ No access token received.");
//       return res.status(403).json({ error: "LinkedIn access token not received" });
//     }

//     const profileRes = await axios.get("https://api.linkedin.com/v2/userinfo", {
//       headers: {
//         Authorization: `Bearer ${accessToken}`,
//       },
//     });

//     const linkedinPersonURN = profileRes.data.sub
//       ? `urn:li:person:${profileRes.data.sub}`
//       : null;

//     if (!linkedinPersonURN) {
//       return res.status(400).json({ error: "Unable to fetch LinkedIn URN" });
//     }

//     // Save tokens and get updated user
//     const updatedUser = await User.findByIdAndUpdate(
//       state,
//       {
//         linkedinAccessToken: accessToken,
//         linkedinPersonURN,
//       },
//       { new: true }
//     );

//     if (!updatedUser || !updatedUser.name) {
//       return res.status(400).json({ error: "User not found or missing name" });
//     }

//     const slugifiedName = updatedUser.name.trim().toLowerCase().replace(/\s+/g, "-");

//     console.log("✅ LinkedIn access token and URN saved.");
//     res.redirect(`http://localhost:3000/dashboard/${slugifiedName}`);

//   } catch (err) {
//     console.error("❌ LinkedIn Callback Error:", err.response?.data || err.message);
//     return res.status(403).json({ error: "LinkedIn OAuth failed" });
//   }
// }

// export const disconnectLinkedIn = async (req, res) => {
//   try {
//     const user = await User.findById(req.user.id);
//     user.linkedinAccessToken = undefined;
//     user.linkedinPersonURN = undefined;
//     await user.save();

//     res.json({ success: true, message: "Disconnected LinkedIn successfully" });
//   } catch (err) {
//     console.error("Error disconnecting LinkedIn:", err.message);
//     res.status(500).json({ error: "Failed to disconnect LinkedIn" });
//   }
// };


// controllers/linkedinController.js
// import axios from "axios";
// import jwt from "jsonwebtoken";
// import User from "../models/User.js";

// export async function linkedinOAuthStart(req, res) {
//   try {
//     const token = req.query.token;
//     if (!token) return res.status(401).json({ msg: "No token, auth denied" });

//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     const userId = decoded.id;

//     const clientId = process.env.LINKEDIN_CLIENT_ID;
//     const redirectUri = process.env.LINKEDIN_REDIRECT_URI;
//     const scope = "openid profile email w_member_social"; // OIDC scopes
//     const state = userId;

//     const authUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(
//       redirectUri
//     )}&state=${state}&scope=${encodeURIComponent(scope)}`;

//     res.redirect(authUrl);
//   } catch (err) {
//     console.error("🔴 OAuth Start Error:", err.message);
//     return res.status(401).json({ msg: "Invalid token" });
//   }
// }

// export async function linkedinOAuthCallback(req, res) {
//   const { code, state } = req.query;

//   if (!code || !state) {
//     console.error("❌ Missing 'code' or 'state' in LinkedIn callback.");
//     return res.status(400).json({ error: "Missing code or state in callback." });
//   }

//   try {
//     // Exchange code for access token
//     const tokenRes = await axios.post(
//       "https://www.linkedin.com/oauth/v2/accessToken",
//       new URLSearchParams({
//         grant_type: "authorization_code",
//         code,
//         redirect_uri: process.env.LINKEDIN_REDIRECT_URI,
//         client_id: process.env.LINKEDIN_CLIENT_ID,
//         client_secret: process.env.LINKEDIN_CLIENT_SECRET,
//       }),
//       {
//         headers: { "Content-Type": "application/x-www-form-urlencoded" },
//       }
//     );

//     const accessToken = tokenRes.data.access_token;
//     if (!accessToken) {
//       console.error("❌ No access token received.");
//       return res.status(403).json({ error: "LinkedIn access token not received" });
//     }

//     // Fetch member info using OIDC endpoint
//     const userInfoRes = await axios.get("https://api.linkedin.com/v2/userinfo", {
//       headers: { Authorization: `Bearer ${accessToken}` },
//     });

//     const { sub, name, email, picture } = userInfoRes.data;
//     const linkedinPersonURN = sub ? `urn:li:person:${sub}` : null;

//     if (!linkedinPersonURN) {
//       return res.status(400).json({ error: "Unable to fetch LinkedIn URN" });
//     }

//     // Save tokens and info to user
//     const updatedUser = await User.findByIdAndUpdate(
//       state,
//       {
//         linkedinAccessToken: accessToken,
//         linkedinPersonURN,
//         linkedinName: name,
//         linkedinEmail: email,
//         linkedinPicture: picture,
//       },
//       { new: true }
//     );

//     if (!updatedUser || !updatedUser.name) {
//       return res.status(400).json({ error: "User not found or missing name" });
//     }

//     const slugifiedName = updatedUser.name.trim().toLowerCase().replace(/\s+/g, "-");
//     console.log("✅ LinkedIn access token and info saved.");
//     res.redirect(`http://localhost:3000/dashboard/${slugifiedName}`);
//   } catch (err) {
//     console.error("❌ LinkedIn Callback Error:", err.response?.data || err.message);
//     return res.status(403).json({ error: "LinkedIn OAuth failed" });
//   }
// }

// export const disconnectLinkedIn = async (req, res) => {
//   try {
//     const user = await User.findById(req.user.id);
//     user.linkedinAccessToken = undefined;
//     user.linkedinPersonURN = undefined;
//     user.linkedinName = undefined;
//     user.linkedinEmail = undefined;
//     user.linkedinPicture = undefined;
//     await user.save();

//     res.json({ success: true, message: "Disconnected LinkedIn successfully" });
//   } catch (err) {
//     console.error("Error disconnecting LinkedIn:", err.message);
//     res.status(500).json({ error: "Failed to disconnect LinkedIn" });
//   }
// };

// export const getLinkedInUserData = async (req, res) => {
//   try {
//     const user = await User.findById(req.user.id);
//     if (!user?.linkedinAccessToken)
//       return res.status(400).json({ error: "LinkedIn not connected" });

//     const accessToken = user.linkedinAccessToken;

//     // Get profile & email via OIDC
//     const userInfoRes = await axios.get("https://api.linkedin.com/v2/userinfo", {
//       headers: { Authorization: `Bearer ${accessToken}` },
//     });

//     const { sub, name, picture, email } = userInfoRes.data;
//     const linkedinPersonURN = sub ? `urn:li:person:${sub}` : null;

//     // Cannot fetch posts yet, placeholder
//     const posts = [];

//     res.json({
//       profile: { name, picture },
//       email,
//       linkedinPersonURN,
//       posts, // empty for now
//     });
//   } catch (err) {
//     console.error("💥 LinkedIn API Error:", err.response?.data || err.message);
//     return res.status(500).json({
//       error: "Failed to fetch LinkedIn user data",
//       details: err.response?.data || err.message,
//     });
//   }
// };



import axios from "axios";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

// ------------------ Start LinkedIn OAuth ------------------
export async function linkedinOAuthStart(req, res) {
  try {
    const token = req.query.token;
    if (!token) return res.status(401).json({ msg: "No token, auth denied" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    // ---- SaaS subscription check ----
    // if (user.subscriptionStatus !== "active") {
    //   return res.status(403).json({ error: "Inactive subscription. Upgrade to connect LinkedIn." });
    // }

    const clientId = process.env.LINKEDIN_CLIENT_ID;
    const redirectUri = process.env.LINKEDIN_REDIRECT_URI;
    const scope = "openid profile email w_member_social"; // OIDC scopes
    const state = userId;

    const authUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(
      redirectUri
    )}&state=${state}&scope=${encodeURIComponent(scope)}`;

    res.redirect(authUrl);
  } catch (err) {
    console.error("🔴 OAuth Start Error:", err.message);
    return res.status(401).json({ msg: "Invalid token" });
  }
}

// ------------------ LinkedIn OAuth Callback ------------------
export async function linkedinOAuthCallback(req, res) {
  const { code, state } = req.query;

  if (!code || !state) {
    console.error("❌ Missing 'code' or 'state' in LinkedIn callback.");
    return res.status(400).json({ error: "Missing code or state in callback." });
  }

  try {
    // Exchange code for access token
    const tokenRes = await axios.post(
      "https://www.linkedin.com/oauth/v2/accessToken",
      new URLSearchParams({
        grant_type: "authorization_code",
        code,
        redirect_uri: process.env.LINKEDIN_REDIRECT_URI,
        client_id: process.env.LINKEDIN_CLIENT_ID,
        client_secret: process.env.LINKEDIN_CLIENT_SECRET,
      }),
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    );

    const accessToken = tokenRes.data.access_token;
    if (!accessToken) {
      console.error("❌ No access token received.");
      return res.status(403).json({ error: "LinkedIn access token not received" });
    }

    // Fetch member info using OIDC endpoint
    const userInfoRes = await axios.get("https://api.linkedin.com/v2/userinfo", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    const { sub, name, email, picture } = userInfoRes.data;
    const linkedinPersonURN = sub ? `urn:li:person:${sub}` : null;

    if (!linkedinPersonURN) {
      return res.status(400).json({ error: "Unable to fetch LinkedIn URN" });
    }

    // Save tokens and info to user
    const updatedUser = await User.findByIdAndUpdate(
      state,
      {
        linkedinAccessToken: accessToken,
        linkedinPersonURN,
        linkedinName: name,
        linkedinEmail: email,
        linkedinPicture: picture,
      },
      { new: true }
    );

    if (!updatedUser || !updatedUser.name) {
      return res.status(400).json({ error: "User not found or missing name" });
    }

    const slugifiedName = updatedUser.name.trim().toLowerCase().replace(/\s+/g, "-");
    console.log("✅ LinkedIn access token and info saved.");
    res.redirect(`http://localhost:3000/dashboard/${slugifiedName}`);
  } catch (err) {
    console.error("❌ LinkedIn Callback Error:", err.response?.data || err.message);
    return res.status(403).json({ error: "LinkedIn OAuth failed" });
  }
}

// ------------------ Disconnect LinkedIn ------------------
export const disconnectLinkedIn = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    // // ---- SaaS subscription check ----
    // if (user.subscriptionStatus !== "active") {
    //   return res.status(403).json({ error: "Inactive subscription. Cannot disconnect LinkedIn." });
    // }

    user.linkedinAccessToken = undefined;
    user.linkedinPersonURN = undefined;
    user.linkedinName = undefined;
    user.linkedinEmail = undefined;
    user.linkedinPicture = undefined;
    await user.save();

    res.json({ success: true, message: "Disconnected LinkedIn successfully" });
  } catch (err) {
    console.error("Error disconnecting LinkedIn:", err.message);
    res.status(500).json({ error: "Failed to disconnect LinkedIn" });
  }
};

// ------------------ Get LinkedIn User Data ------------------
export const getLinkedInUserData = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user?.linkedinAccessToken) {
      return res.status(400).json({ error: "LinkedIn not connected" });
    }

    // ---- SaaS subscription check ----
    // if (user.subscriptionStatus !== "active") {
    //   return res.status(403).json({ error: "Inactive subscription. Cannot fetch LinkedIn data." });
    // }

    const accessToken = user.linkedinAccessToken;

    const userInfoRes = await axios.get("https://api.linkedin.com/v2/userinfo", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    const { sub, name, picture, email } = userInfoRes.data;
    const linkedinPersonURN = sub ? `urn:li:person:${sub}` : null;

    // Placeholder for posts
    const posts = [];

    res.json({
      profile: { name, picture },
      email,
      linkedinPersonURN,
      posts,
    });
  } catch (err) {
    console.error("💥 LinkedIn API Error:", err.response?.data || err.message);
    return res.status(500).json({
      error: "Failed to fetch LinkedIn user data",
      details: err.response?.data || err.message,
    });
  }
};
