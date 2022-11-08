import { Link, useLoaderData } from '@remix-run/react';
import { sendRequest } from '~/utils/config';

export const loader = async ({ params }) => {

  const res = await sendRequest(`users/${params.userId}`, 'get');


  return res.error ? [] : res.post

};

const PostItems = () => {
  const posts = useLoaderData();

  return (
    <>
      <div className='page-header'>
        <h1>Posts</h1>
        <Link to='./posts/new' className='btn'>
          Create Post
        </Link>
      </div>

      {posts?.length > 0 ?

        <ul className='posts-list'>
          {posts.map((post, index) => (
            <li key={index}>
              <Link to={"./posts/" + post.title}>
                <h3>{post.title}</h3>
              </Link>
            </li>
          ))}
        </ul> : <div>
          <h3>There are no Post...</h3>
          <br />
          <Link to='./posts/new' className='btn'>
            Create Post
          </Link>
        </div>

      }
    </>
  );
};

export default PostItems;
