import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { signInWithGoogle, signOut } from '../lib/auth';
import { buttonBase, colors } from './ui';

const Navbar = () => {
    const { user, profile } = useAuth();

    return (
        <nav className="bg-white border-b border-gray-200">
            <div className="max-w-6xl mx-auto px-6 py-3 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                <Link
                    to="/"
                    className="text-xl font-semibold text-emerald-600"
                >
                    BlogCMS
                </Link>


                <div className="space-x-3">
                    {user ? (
                        <>
                            <span className="text-sm text-gray-600 mr-4">
                                Welcome,&nbsp;
                                <span className="font-medium text-emerald-700">
                                    {profile?.full_name || 'User'}
                                </span>
                            </span>


                            <Link
                                to="/dashboard"
                                className={`${buttonBase} ${colors.primaryOutline}`}
                            >
                                Dashboard
                            </Link>
                            <button
                                onClick={signOut}
                                className={`${buttonBase} ${colors.primary}`}
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <button
                            onClick={signInWithGoogle}
                            className={`${buttonBase} ${colors.primary}`}
                        >
                            Sign in with Google
                        </button>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
