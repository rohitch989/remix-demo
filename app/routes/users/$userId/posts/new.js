import { redirect } from '@remix-run/node';
import { Link, useParams, useFetcher } from '@remix-run/react';
import { addPost } from '~/utils/mockFn';

export const action = async ({ request, params }) => {
  const form = await request.formData();

  const title = form.get('title');
  const body = form.get('body');

  if (title && body) {
    const res = await addPost(params.userId, { title, body })

    if (res?.error)
      return res;
    else
      return redirect(`/users/${params.userId}`)
  }
  else {
    return { error: "Empty fields are not allowed !" }
  }
};

const NewPost = () => {
  const { userId } = useParams()
  const fetchers = useFetcher();

  return (
    <>
      <div className='page-header'>
        <h1>New Posts</h1>
        <Link to={`/users/${userId}`} className='btn btn-reverse'>
          Back
        </Link>
      </div>
      <div className='page-content'>
        <fetchers.Form method='post'>
          <div className='form_control'>
            <label htmlFor='title'>Title</label>
            <input type='text' name='title' id='title' />
          </div>
          <div className='form_control'>
            <label htmlFor='body'>Title</label>
            <textarea name='body' id='body' />
          </div>
          <button type='submit' className='btn btn-block'>
            Add Post
          </button>
        </fetchers.Form>
      </div>
    </>
  );
};

export default NewPost;
