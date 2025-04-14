import User from '@/models/User';
import dbConnect from '@/lib/dbConnect';

export async function GET(req) {
  try {
    await dbConnect();

    // Get the current user's ID from query param (you can change this later to session-based auth)
    const { searchParams } = new URL(req.url);
    const currentUserId = searchParams.get('currentUserId');

    const users = await User.find({ _id: { $ne: currentUserId } }).select('_id username email');

    return new Response(JSON.stringify(users), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (err) {
    return new Response(JSON.stringify({ message: 'Failed to fetch users', error: err.message }), {
      status: 500,
    });
  }
}
