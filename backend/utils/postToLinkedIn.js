import axios from "axios";
import fetch from "node-fetch";
import mime from "mime-types";

export async function postToLinkedIn(user, { title, content, image }) {
  if (!user.linkedinAccessToken || !user.linkedinPersonURN) {
    throw new Error("User is not connected to LinkedIn.");
  }

  let assetURN = null;

  if (image) {
    try {
      console.log("Image received:", image?.substring(0, 100)); // Log partial image string

      const registerRes = await axios.post(
        "https://api.linkedin.com/v2/assets?action=registerUpload",
        {
          registerUploadRequest: {
            owner: user.linkedinPersonURN,
            recipes: ["urn:li:digitalmediaRecipe:feedshare-image"],
            serviceRelationships: [
              {
                relationshipType: "OWNER",
                identifier: "urn:li:userGeneratedContent",
              },
            ],
            supportedUploadMechanism: ["SYNCHRONOUS_UPLOAD"],
          },
        },
        {
          headers: {
            Authorization: `Bearer ${user.linkedinAccessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      const uploadUrl =
        registerRes.data.value.uploadMechanism["com.linkedin.digitalmedia.uploading.MediaUploadHttpRequest"].uploadUrl;
      assetURN = registerRes.data.value.asset;

      // Detect MIME and get buffer
      let imageBuffer;
      let mimeType = "image/jpeg";

      if (image.startsWith("data:image/")) {
        const matches = image.match(/^data:(image\/[a-zA-Z]+);base64,(.+)$/);
        if (matches) {
          mimeType = matches[1];
          imageBuffer = Buffer.from(matches[2], "base64");
        } else {
          throw new Error("Invalid base64 image format.");
        }
      } else {
        const imageResponse = await fetch(image, {
          headers: {
            "User-Agent": "Mozilla/5.0", // Prevent 403 on some CDNs
          },
        });

        if (!imageResponse.ok) {
          throw new Error(`Image fetch failed: ${imageResponse.status}`);
        }

        imageBuffer = await imageResponse.buffer();

        const ext = image.split(".").pop().split("?")[0];
        const guessedMime = mime.lookup(ext);
        if (guessedMime) mimeType = guessedMime;
      }

      console.log("📤 Uploading image to LinkedIn...");
      await axios.put(uploadUrl, imageBuffer, {
        headers: {
          "Content-Type": mimeType,
        },
      });

      console.log(`✅ LinkedIn image uploaded (${mimeType})`);
      console.log("📎 Asset URN:", assetURN);
    } catch (err) {
      console.error("❌ LinkedIn image upload error:", err.response?.data || err.message);
      throw new Error("Image upload to LinkedIn failed.");
    }
  }

  // Construct post body
  const postBody = {
    author: user.linkedinPersonURN,
    lifecycleState: "PUBLISHED",
    specificContent: {
      "com.linkedin.ugc.ShareContent": {
        shareCommentary: {
          text: `${title}\n\n${content}`,
        },
        shareMediaCategory: assetURN ? "IMAGE" : "NONE",
        media: assetURN
          ? [
              {
                status: "READY",
                description: { text: "Blog Thumbnail" },
                media: assetURN,
                title: { text: title },
              },
            ]
          : [],
      },
    },
    visibility: {
      "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC",
    },
  };

  // Post to LinkedIn
  const result = await axios.post("https://api.linkedin.com/v2/ugcPosts", postBody, {
    headers: {
      Authorization: `Bearer ${user.linkedinAccessToken}`,
      "Content-Type": "application/json",
    },
  });

  console.log("✅ LinkedIn post created");
  console.log("📎 LinkedIn Post URN:", result.data.id);
  return { success: true, postId: result.data.id };
}
