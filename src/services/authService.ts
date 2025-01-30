import User from "@/models/User";
import {connectToDatabase} from "@/lib/mongoose";

export async function findOrCreateUser(github_id: string) {
    if(!github_id) return undefined;
    
    await connectToDatabase();

    let user = await User.findOne({ github_id: github_id });

    if (!user) {
        user = new User({ github_id: github_id, verified: false });
        await user.save();
    }

    console.log(`🔹 User found or created: ${user}`);
    return user;
}
