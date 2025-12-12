import axios from "axios";
import TryCatch from "../utils/TryCatch.js";
import { sql } from "../utils/db.js";
import { redisClient } from "../server.js";

export const getAllBlogs = TryCatch(async (req, res) => {
  const { searchQuery, category } = req.query;


  const cacheKey = `blogs:${searchQuery}:${category}`;
  const cached = await redisClient.get(cacheKey);

  if(cached) {
    console.log("Serving from redis cache ");
    res.json(JSON.parse(cached));
    return;
  }

  let blogs;

  // 1️⃣ search + category
  if (searchQuery && category) {
    blogs = await sql`
      SELECT * FROM blogs 
      WHERE (title ILIKE ${"%" + searchQuery + "%"} 
         OR description ILIKE ${"%" + searchQuery + "%"})
        AND category = ${category}
      ORDER BY created_at DESC
    `;
  }

  // 2️⃣ search only
  else if (searchQuery) {
    blogs = await sql`
      SELECT * FROM blogs 
      WHERE title ILIKE ${"%" + searchQuery + "%"} 
         OR description ILIKE ${"%" + searchQuery + "%"}
      ORDER BY created_at DESC
    `;
  }

  // 3️⃣ category only
  else if (category) {
    blogs = await sql`
      SELECT * FROM blogs 
      WHERE category = ${category}
      ORDER BY created_at DESC
    `;
  }

  // 4️⃣ no filters
  else {
    blogs = await sql`
      SELECT * FROM blogs 
      ORDER BY created_at DESC
    `;
  }
 await redisClient.set(cacheKey, JSON.stringify(blogs), {EX: 3600})
  res.json(blogs);
});


export const getSingleBlog = TryCatch(async (req, res) => {
  const blog = await sql`
    SELECT * FROM blogs WHERE id = ${req.params.id}
  `;
const blogid = req.params.id
const cacheKey = `blog:${blogid}`
const  cached = await redisClient.get(cacheKey);

 if(cached) {
    console.log("Serving from redis cache ");
    res.json(JSON.parse(cached));
    return;
  }
  // 1️⃣ blog not found → return early
  if (!blog.length) {
    return res.status(404).json({
      message: "Blog not found",
    });
  }
console.log("USER_SERVICE =", process.env.USER_SERVICE);

  // 2️⃣ call user service to get author details
  const { data } = await axios.get(
    `${process.env.USER_SERVICE}/api/v1/user/${blog[0].author}`
  );
  const responseData = {
    blog: blog[0],
    author: data,
  }

  await redisClient.set(cacheKey, JSON.stringify(responseData), {EX: 3600})
  // 3️⃣ respond cleanly
  res.json(responseData);
});
