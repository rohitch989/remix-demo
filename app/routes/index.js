import { Link } from "@remix-run/react";

export const action = async ({ request }) => {
  const form = await request.formData();
  console.log(form);
};
function Home() {
  return (
    <div>
      <h1>Welcome to Remix!</h1>
      <p>
        Remix is a full stack web framework by the creators of React Router.
      </p>
      <Link to="/users" className="btn btn-primary">
        Go to Record
      </Link>
    </div>
  );
}

export default Home;
