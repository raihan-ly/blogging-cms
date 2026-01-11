import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import PostForm from '../components/PostForm';
import PostItem from '../components/PostItem';

const Dashboard = () => {
    const { user } = useAuth();
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchMyPosts = async () => {
        setLoading(true);

        const { data } = await supabase
            .from('posts')
            .select('*')
            .eq('author_id', user.id)
            .order('created_at', { ascending: false });

        setPosts(data || []);
        setLoading(false);
    };

    useEffect(() => {
        if (user) fetchMyPosts();
    }, [user]);

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-2xl font-semibold mb-6">My Dashboard</h1>

            {loading && <p>Loading...</p>}
            {!loading && posts.length === 0 && (<p className="text-gray-500">No posts yet.</p>)}

            <PostForm onSuccess={fetchMyPosts} />

            <div className="mt-8 space-y-4">
                {posts.map((post) => (
                    <PostItem
                        key={post.id}
                        post={post}
                        onChange={fetchMyPosts}
                    />
                ))}
            </div>
        </div>
    );
};

export default Dashboard;
