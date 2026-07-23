import crypto from "crypto";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    if (!file) return NextResponse.json({ error: "No file provided" }, { status: 400 });

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64 = buffer.toString("base64");
    const dataUri = `data:${file.type};base64,${base64}`;

    const cloudName = process.env.CLOUDINARY_CLOUD_NAME || "dmsknphr";
    const apiKey = process.env.CLOUDINARY_API_KEY || "6X4FkDV4FMBO8172h1hMLDEQmfg";
    const apiSecret = process.env.CLOUDINARY_API_SECRET;
    const uploadPreset = process.env.CLOUDINARY_UPLOAD_PRESET || "ml_default";

    console.log("[cloudinary] cloudName:", cloudName);
    console.log("[cloudinary] apiKey:", apiKey ? "set" : "missing");
    console.log("[cloudinary] apiSecret:", apiSecret ? "set" : "missing");
    console.log("[cloudinary] uploadPreset:", uploadPreset);

    const uploadFormData = new FormData();
    uploadFormData.append("file", dataUri);

    if (uploadPreset) {
      uploadFormData.append("upload_preset", uploadPreset);
      console.log("[cloudinary] using unsigned upload with preset:", uploadPreset);
    } else if (apiSecret) {
      const timestamp = Math.round(Date.now() / 1000);
      const signature = crypto.createHash("sha1").update(`timestamp=${timestamp}${apiSecret}`).digest("hex");
      uploadFormData.append("timestamp", String(timestamp));
      uploadFormData.append("api_key", apiKey);
      uploadFormData.append("signature", signature);
      console.log("[cloudinary] using signed upload");
    } else {
      return NextResponse.json({ error: "Configure CLOUDINARY_UPLOAD_PRESET or CLOUDINARY_API_SECRET in .env" }, { status: 500 });
    }

    const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
    console.log("[cloudinary] posting to:", uploadUrl);

    const res = await fetch(uploadUrl, { method: "POST", body: uploadFormData });
    const data = await res.json();

    console.log("[cloudinary] response status:", res.status);
    console.log("[cloudinary] response body:", JSON.stringify(data, null, 2));

    if (!res.ok) {
      return NextResponse.json({ error: data.error?.message || "Upload failed" }, { status: 500 });
    }

    return NextResponse.json({ url: data.secure_url, publicId: data.public_id });
  } catch (error) {
    console.error("[cloudinary] exception:", error);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
