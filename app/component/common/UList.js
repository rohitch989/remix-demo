import List from "./List";
import { Link, useFetcher } from "@remix-run/react";

function UList({ className, user, children, id }) {
  const fetcher = useFetcher();

  if (user) {
    const isDeleting = fetcher?.submission?.formData.get('_uuid') === user?._uuid;

    return (
      <>
        {isDeleting && fetcher.data?.success ?
          <div style={{ textAlign: 'center', backgroundColor: 'lightcoral', color: '#fff', borderRadius: "5px" }}>
            {fetcher.data.success.default}
          </div> : null
        }

        <ul className={className} style={{ opacity: isDeleting ? '0.25' : 1 }} >
          <List className="id" >
            <fetcher.Form method="post">
              <input type='hidden' name='_uuid' value={user._uuid} />
              <button className="btn-delete" name="_action" value='delete' type='submit'>X</button>&nbsp;
              {id + 1}</fetcher.Form></List>
          <List className="name">{`${user.firstName} ${user.maidenName ? user.maidenName : "_"
            } ${user.lastName ? user.lastName : "_"}`}</List>
          <List className="username">{user.username ? user.username : "_"}</List>
          <List className="age">{user.age ? user.age : "_"}</List>
          <List className="gender">{user.gender}</List>
          <List className="contact">
            Email:{user.email ? user.email : "_"}
            <br /> phone: {user.phone ? user.phone : "_"}
          </List>

          <List className="post"><Link to={"./" + user._uuid}>
            <button className="btn btn-primary" style={{ fontSize: '10px', boxShadow: '2px 2px green' }} >{user?.post && user?.post?.length > 0 ? user.post.length : "+ Add Post"}</button>
          </Link></List>
        </ul>
      </>
    );
  }
  else {
    return children ? <ul className={className}>{children}</ul> : null;
  }
}

export default UList;
