// create api to get and upload images / video / audio files to supabase buckets
// you need to upload images of user to user bucket file name having user_id as name
// you need to upload quiz images / video / audio to supabase bucket in quizes inside quiz_id folder and file name having question_id as name
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { supabase } from "@/app/lib/dbConnect";
const secretKey = process.env.SECRET_KEY as string;

export const POST = async (req: Request) => {
    try {
        const cookieStore = await cookies();
        let token = cookieStore.get("token")?.value;
        
        // If no token in cookies, check Authorization header
        if (!token) {
            const authHeader = req.headers.get("authorization");
            if (authHeader && authHeader.startsWith("Bearer ")) {
                token = authHeader.substring(7);
            }
        }
        
        console.log("Token:", token);
        // console.log("All cookies:", cookieStore.getAll());
        
        if (!token) {
            return NextResponse.json({
                status: 401,
                message: "Unauthorized: No token",
            });
        }

        const decoded = jwt.verify(token, secretKey) as { id: number };
        console.log("Decoded token:", decoded);

        const formData = await req.formData();
        const file = formData.get("file") as File;
        const useridString = formData.get("userid") as string;
        const type = formData.get("type") as string;
        const detailsString = formData.get("details") as string;
        const details = detailsString ? JSON.parse(detailsString) : null;

        console.log("useridString from FormData:", useridString);
        console.log("All FormData entries:", Array.from(formData.entries()));

        if (!useridString || useridString === "null") {
            return NextResponse.json({
                status: 400,
                message: "User ID is required",
            });
        }

        const userid = parseInt(useridString);
        if (isNaN(userid)) {
            return NextResponse.json({
                status: 400,
                message: "Invalid User ID format",
            });
        }

        console.log("userid (parsed):", userid, "type:", typeof userid);
        console.log("decoded.id:", decoded.id, "type:", typeof decoded.id);

        if (userid !== decoded.id) {
            console.log("User ID mismatch:", userid, decoded.id);
            return NextResponse.json({
                status: 403,
                message: "Forbidden: User ID mismatch",
            });
        }

    if (!file) {
      return NextResponse.json({ status: 400, message: "No file provided" });
    }

        if (type === "user") {
            const { data, error } = await supabase.storage
                .from("users")
                .upload(`${decoded.id}`, file);
            if (error) {
                return NextResponse.json({
                    status: 500,
                    message: "Error uploading file",
                    error,
                });
            }
            
            // Get public URL
            const { data: urlData } = supabase.storage
                .from("users")
                .getPublicUrl(`${decoded.id}`);
            
            return NextResponse.json({
                status: 200,
                message: "File uploaded successfully",
                data,
                publicUrl: urlData.publicUrl,
            });
    } else if (type === "quiz") {
      const { quizId, questionId } = details;
      console.log("Quiz ID:", quizId, "Question ID:", questionId);
      const { data, error } = await supabase.storage
        .from("quizzes")
        .upload(`${quizId}/${questionId}`, file);
      if (error) {
        return NextResponse.json({
          status: 500,
          message: "Error uploading file",
          error,
        });
      }
      
      // Get public URL
      const { data: urlData } = supabase.storage
        .from("quizes")
        .getPublicUrl(`${quizId}/${questionId}`);
      
      return NextResponse.json({
        status: 200,
        message: "File uploaded successfully",
        data,
        publicUrl: urlData.publicUrl,
      });
    }
  } catch (err) {
    console.log("Error in POST /upload:", err);
    return NextResponse.json({ status: 401, message: "Invalid token" });
  }
};
