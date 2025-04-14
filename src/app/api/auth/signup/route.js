import User from "@/models/User";
import dbConnect from "@/lib/dbConnect";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
export async function POST(req) {
  try {
    const { email, password, username } = await req.json();

    if (!email || !password) {
      return new Response(JSON.stringify({ message: 'Email and password are required' }), {
        status: 400,
      });
    }

    await dbConnect();

    let user = await User.findOne({ email });

    if (!user) {
      if (!username) {
        return new Response(JSON.stringify({ message: 'Username is required for signup' }), {
          status: 400,
        });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      user = await User.create({
        email,
        password: hashedPassword,
        username, // 👈 use the actual username from the form
      });
    } else {
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return new Response(JSON.stringify({ message: 'Invalid credentials' }), {
          status: 401,
        });
      }
    }

    const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, {
      expiresIn: '1d',
    });

    return new Response(JSON.stringify({
      token,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
      },
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (err) {
    console.error('Error in login/signup:', err);
    return new Response(JSON.stringify({ message: 'Server error', error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
