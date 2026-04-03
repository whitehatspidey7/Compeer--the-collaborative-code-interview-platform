

import {db} from "@/lib/db";
import { createRoom } from "@/server/room-actions";
import { notFound } from "next/navigation";

export default async function Dashboard()
{
    // fetch the dummy user from the db
    let user;

    try
    {
        user = await db.user.findUnique({
        where: {
            email: "spiderman@gmail.com"
            }
        });
    }
    catch(E)
    {
        console.log(E);
        throw new Error;
    }
    
    if(user==null)
    {
        // <h2>Dummy user not found in the db</h2>
        notFound();
    }

    // create an interview-room with the dummy user, use the createRoom

    const createRoomHandler =  async (FormData:FormData) =>{
        "use server"
        try
        {
            const userId = FormData.get("userId") as string;
            // "use server"
           await createRoom(userId)
        }
        catch(e)
        {
            console.log(e);
            throw e;
        }   
    };

    return(
        <div className="p-20">
      <h1>Welcome {user.name}</h1>
      
      {/* The form 'action' triggers our function only on click */}
      <form action={createRoomHandler}>
         <input type="hidden" name="userId" value={user.id} />
        <button className="bg-indigo-600 text-white p-4 rounded">
          Create Room
        </button>
      </form>
    </div>
    );
}