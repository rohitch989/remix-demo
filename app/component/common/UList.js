import List from "./List";

function UList({ className, user, children }) {
  if (user)
    return (
      <ul className={className}>
        <List className="id">{user.id}</List>
        <List className="name">{`${user.firstName} ${
          user.maidenName ? user.maidenName : "_"
        } ${user.lastName ? user.lastName : "_"}`}</List>
        <List className="username">{user.username ? user.username : "_"}</List>
        <List className="age">{user.age ? user.age : "_"}</List>
        <List className="gender">{user.gender}</List>
        <List className="contact">
          Email:{user.email ? user.email : "_"}
          <br /> phone: {user.phone ? user.phone : "_"}
        </List>
        <List className="birth">{user.birthDate ? user.birthDate : "_"}</List>
      </ul>
    );
  else {
    return children ? <ul className={className}>{children}</ul> : null;
  }
}

export default UList;
