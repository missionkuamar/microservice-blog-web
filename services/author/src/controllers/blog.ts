import { AuthenticatedRequest } from "../middleware/isAuth";
import getBuffer from "../utils/dataUri";
import { sql } from "../utils/db";
import TryCatch from "../utils/TryCatch";
import { v2 as cloudinary } from "cloudinary";

export const createBlog = TryCatch(async (req: AuthenticatedRequest, res) => {
    const { title, description, blogcontent, category } = req.body;

    const file = req.file;
    if (!file) return res.status(400).json({ message: "no file to upload" });

    const fileBuffer = getBuffer(file);
    if (!fileBuffer?.content)
        return res.status(400).json({ message: "Failed to generate buffer" });

    const cloud = await cloudinary.uploader.upload(fileBuffer.content, {
        folder: "blogs",
    });

    const result = await sql`
    INSERT INTO blogs 
    (title, description, image, blogcontent, category, author)
    VALUES (${title}, ${description}, ${cloud.secure_url}, ${blogcontent}, ${category}, ${req.user?._id})
    RETURNING *;
  `;

    res.json({
        message: "Blog created",
        blog: result[0],
    });
});


export const updateBlog = TryCatch(async (req: AuthenticatedRequest, res) => {
  const { id } = req.params;
  const { title, description, blogcontent, category } = req.body;
  const file = req.file;
  
  // 1️⃣ Get blog
  const blog = await sql`SELECT * FROM blogs WHERE id = ${id}`;
  if (!blog.length) {
    return res.status(404).json({ message: "No blog with this id" });
  }

  // 2️⃣ Auth check
  if (blog[0].author !== req.user?._id) {
    return res.status(401).json({ message: "You are not author of this blog" });
  }

  // 3️⃣ Handle image update
  let imageUrl = blog[0].image;

  if (file) {
    const fileBuffer = getBuffer(file);
    if (!fileBuffer?.content) {
      return res.status(400).json({ message: "Failed to generate buffer" });
    }

    const cloud = await cloudinary.uploader.upload(fileBuffer.content, {
      folder: "blogs",
    });

    imageUrl = cloud.secure_url;
  }

  // 4️⃣ Update blog
  const updatedBlog = await sql`
    UPDATE blogs SET
      title = ${title || blog[0].title},
      description = ${description || blog[0].description},
      image = ${imageUrl},
      blogcontent = ${blogcontent || blog[0].blogcontent},
      category = ${category || blog[0].category}
    WHERE id = ${id}
    RETURNING *;
  `;

  res.json({
    message: "Blog Updated",
    blog: updatedBlog[0],
  });
});
