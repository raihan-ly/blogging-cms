import { useState } from 'react';
import { supabase } from '../lib/supabase';

const PostItem = ({ post, onChange }) => {
    const [editing, setEditing] = useState(false);
    const [title, setTitle] = useState(post.title);
    const [content, setContent] = useState(post.content);

    const updatePost = async () => {
        await supabase
            .from('posts')
            .update({ title, content })
            .eq('id', post.id);

        setEditing(false);
        onChange();
    };

    const deletePost = async () => {
        await supabase
            .from('posts')
            .delete()
            .eq('id', post.id);

        onChange();
    };

    const togglePublish = async () => {
        await supabase
            .from('posts')
            .update({ published: !post.published })
            .eq('id', post.id);

        onChange();
    };

    return (
        <div className="border rounded p-4">
            {editing ? (
                <>
                    <input
                        className="w-full border p-2 mb-2"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                    <textarea
                        className="w-full border p-2 mb-2"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                    />
                    <button onClick={updatePost} className="mr-2">
                        Save
                    </button>
                    <button onClick={() => setEditing(false)}>
                        Cancel
                    </button>
                </>
            ) : (
                <>
                    <h3 className="text-lg font-semibold">{post.title}</h3>
                    <p className="text-sm text-gray-500">
                        {post.published ? 'Published' : 'Draft'}
                    </p>
                    <div className="mt-2 space-x-3">
                        <button onClick={() => setEditing(true)}>Edit</button>
                        <button onClick={deletePost}>Delete</button>
                        <button onClick={togglePublish}>
                            {post.published ? 'Unpublish' : 'Publish'}
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default PostItem;
