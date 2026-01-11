import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';

const PostDetail = () => {
    const { id } = useParams();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPost = async () => {
            const { data } = await supabase
                .from('posts')
                .select(`
                title,
                content,
                created_at,
                public_profiles (full_name)`)
                .eq('id', id)
                .eq('published', true)
                .single();

            setPost(data);
            setLoading(false);
        };

        fetchPost();
    }, [id]);

    if (loading) return <p className="p-6">Loading...</p>;
    if (!post) return <p className="p-6">Post not found.</p>;

    return (
        <div className="max-w-3xl mx-auto p-6">
            <h1 className="text-3xl font-semibold text-gray-900">{post.title}</h1>

            <p className="text-sm text-gray-500 mt-2">
                By <span className="font-medium">
                    {post.public_profiles?.full_name || 'Anonymous'}
                </span>
                {' · '}
                {new Date(post.created_at).toLocaleDateString()}
            </p>

            <article className="mt-6 text-gray-800 leading-relaxed whitespace-pre-line">
                {post.content}
            </article>
        </div>
    );
};

export default PostDetail;
