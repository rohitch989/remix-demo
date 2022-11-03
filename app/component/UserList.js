import UList from "./common/UList";
function UserList({ className, users, searchUser }) {
  return (
    <div className={className}>
      {searchUser && searchUser.length > 0
        ? searchUser.map((user, index) => (
          <UList className="user" user={user} key={user.id} />
        ))
        : users.map((user, index) => (
          <UList className="user" user={user} key={user.id} />
        ))}
    </div>
  );
}

export default UserList;
