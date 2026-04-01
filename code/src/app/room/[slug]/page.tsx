import { db } from "@/lib/db";
import { notFound } from "next/navigation";

// Next.js 15 uses a Promise for params
interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function RoomPage({ params }: PageProps) 
{
  // 1. Un-wrap the params to get the slug
  const { slug } = await params;

  // 2. Fetch the room from the database
  // Hint: Look for the 'slug' and use 'include' to get the 'createdBy' user info
    let room;
    try
    {
        room = await db.room.findUnique({
          where: {
            slug: slug
          },

          include: {
            createdBy: true,
          }
        });
    }
    catch(error)
    {
      console.log(error);
      throw new Error;
    }

  // 3. If the room is null, show the built-in Next.js 404 page
  if(!room) {
    notFound();
  }

  
    return (
  <div className="min-h-screen bg-slate-900 text-white p-10">
    <div className="max-w-4xl mx-auto">
      
      {/* 1. Display the Room's Slug */}
      <h1 className="text-4xl font-bold mb-4">
        Room: { room.slug }
      </h1>
      
      <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
        <p className="text-slate-400">Host Information</p>
        
        {/* 2. Display the Creator's Name */}
        {/* Remember: This came from the 'include' we added! */}
        <h2 className="text-xl font-semibold">
          Host: { room.createdBy.name }
        </h2>

        {/* 3. Display the Room's Programming Language */}
        <p className="mt-2 text-indigo-400 font-mono uppercase">
          Language: { room.language }
        </p>
      </div>

      <div className="mt-10 h-64 border-2 border-dashed border-slate-700 flex items-center justify-center rounded-xl">
        <p className="text-slate-500 italic">
          Code Editor coming in Week 2...
        </p>
      </div>
    </div>
  </div>
    );
  
}