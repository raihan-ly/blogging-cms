import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Link } from 'react-router-dom';


const PublicFeed = () => {
    const [posts, setPosts] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);

    const fetchPosts = async () => {
        setLoading(true);

        let query = supabase
            .from('posts')
            .select(`
            id,
            title,
            content,
            created_at,
            public_profiles (full_name)`)
            .eq('published', true)
            .order('created_at', { ascending: false });

        if (search) {
            query = query.ilike('title', `%${search}%`);
        }

        const { data } = await query;
        setPosts(data || []);
        setLoading(false);
    };

    useEffect(() => {
        fetchPosts();
    }, [search]);

    return (
        <div className="max-w-3xl mx-auto p-6">
            <h1 className="text-2xl font-semibold mb-4">Public Blog Feed</h1>

            <input
                type='text'
                placeholder='Search by title...'
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full border p-2 mb-6 rounded"
            />

            {loading && <p>Loading...</p>}
            {!loading && posts.length === 0 && (<p className="text-gray-500">No posts found.</p>)}

            <div className="space-y-6">
                {posts.map((post) => (
                    <Link
                        to={`/posts/${post.id}`}
                        key={post.id}
                        className="block border rounded p-4 hover:bg-gray-50 transition"
                    >
                        <h2 className="text-xl font-medium text-emerald-700">
                            {post.title}
                        </h2>
                        <p className="text-sm text-gray-500">
                            By <span className="font-medium">
                                {post.public_profiles?.full_name || 'Anonymous'}
                            </span>
                            {' · '}
                            {new Date(post.created_at).toLocaleDateString()}
                        </p>

                        <p className="mt-2 text-gray-700 line-clamp-3">
                            {post.content}
                        </p>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default PublicFeed;
