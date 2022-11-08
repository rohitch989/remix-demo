import { redirect } from '@remix-run/node';
import { Link, useLoaderData, useParams } from '@remix-run/react';
import { sendRequest } from '~/utils/config';


export const loader = async ({ params }) => {


  const res = await sendRequest(`users/${params.userId}`, 'get');
  if (res.error)
    throw new Error(res.error)
  else {
    const post = res.post.filter(post => post.title === params.postId)[0];

    if (!post) throw new Error('Post not found !');

    return post
  }
};

export const action = async ({ request, params }) => {
  const form = await request.formData();
  if (form.get('_method') === 'delete') {
    const res = await sendRequest(`users/${params.userId}`, 'get');
    if (res.error)
      throw new Error(res.error);


    const deletedpost = res.post.filter(p => p.title !== params.postId);
    const m = await sendRequest('users', 'put', { _uuid: params.userId, post: deletedpost });
    if (m?.error) {
      return { error: m.error }
    }
    return redirect(`/users/${params.userId}`);
  }
};

const Post = () => {
  const post = useLoaderData();
  const { userId } = useParams()
  return (
    <div>
      <div className='page-header'>
        <h1>{post.title}</h1>
        <Link to={`/users/${userId}`} className='btn btn-reverse'>
          Back
        </Link>
      </div>
      <div className='page-content'>{post.body}</div>
      <div className='page-footer'>
        <form method='POST'>
          <input type='hidden' name='_method' value='delete' />
          <button className='btn btn-delete'>Delete</button>
        </form>
      </div>
    </div>
  );
};

export default Post;
