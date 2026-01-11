import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

const PostForm = ({ onSuccess }) => {
    const { user } = useAuth();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        await supabase.from('posts').insert({
            title,
            content,
            author_id: user.id,
        });

        setTitle('');
        setContent('');
        setLoading(false);
        onSuccess();
    };

    return (
        <form onSubmit={handleSubmit} className="border p-4 rounded">
            <h2 className="text-lg font-medium mb-2">New Post</h2>

            <input
                className="w-full border p-2 mb-2 rounded"
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
            />

            <textarea
                className="w-full border p-2 mb-2 rounded"
                placeholder="Content"
                rows={4}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
            />

            <button disabled={loading} className="bg-black text-white px-4 py-2 rounded">
                Create
            </button>
        </form>
    );
};

export default PostForm;
