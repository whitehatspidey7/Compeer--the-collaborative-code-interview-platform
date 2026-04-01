
"user servers"

import {db} from '@lib/db';
import {nanoid} from 'nanoid';
import {redirect} from 'next/navigation';

export async function createRoom(userId: string)
{
    const slug = nanoid(10); //slug used to identify the room

    try
    { // creating a room in the db
        const newRoom = await db.room.create({
            data : {
                slug: slug,
                createdById: userId,
                language: "javascript"
            }
        });
        
        // add the user who created the room as interviewer into participants.
        await db.participant.create({
            
            data: {
                userId: userId,
                roomId: newRoom.id,
                role: "interviewer"
            }

        });

    }
    catch(error)
    {
        console.log("Failed to create a room! " + error);
        throw new Error("Database error: Could not create the interview room.");
    }

    //  Redirect the user to the dynamic route: /room/[slug], upon creation of room
    redirect(`/room/${slug}`);
};

