import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import dbConnect from '@/lib/mongoose';
import User from '@/models/User';

const handler = NextAuth({
	providers: [
		CredentialsProvider({
			name: 'credentials',
			credentials: {
				email: { label: 'Email', type: 'email' },
				password: { label: 'Password', type: 'password' },
			},
			async authorize(credentials) {
				if (!credentials?.email || !credentials?.password) {
					return null;
				}

				try {
					await dbConnect();
					const user = await User.findOne({ email: credentials.email }).select(
						'+password'
					);

					if (!user) {
						return null;
					}

					const isPasswordValid = await user.comparePassword(
						credentials.password
					);

					if (!isPasswordValid) {
						return null;
					}

					return {
						id: user._id.toString(),
						email: user.email,
						name: user.name,
						role: user.role,
					};
				} catch (error) {
					console.error('Auth error:', error);
					return null;
				}
			},
		}),
	],
	session: {
		strategy: 'jwt',
	},
	callbacks: {
		async jwt({ token, user }) {
			if (user) {
				token.role = (user as any).role;
			}
			return token;
		},
		async session({ session, token }) {
			if (token && session.user) {
				(session.user as any).id = token.sub;
				(session.user as any).role = token.role;
			}
			return session;
		},
	},
	pages: {
		signIn: '/auth/signin',
		// signUp: '/auth/signup',
	},
	secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };
