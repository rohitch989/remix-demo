import {
  Form,
  useActionData,
  useTransition,
  useLoaderData,
  useSubmit,
} from "@remix-run/react";
import { json } from "@remix-run/node";
import { useEffect, useRef } from "react";
import { fetchUser } from "~/utils/user.server";
import { add_User_Action, search_User_Action } from "~/utils/mockFn";
import RemixInput from "~/component/common/RemixInput";
import List from "~/component/common/List";
import UList from "~/component/common/UList";
import UserList from "~/component/UserList";

let userList;

export const action = async ({ request }) => {
  const form = await request.formData();
  const { _action, ...data } = Object.fromEntries(form);
  let actionData = {};

  switch (_action) {
    case 'add':
      actionData = await add_User_Action(data)
      break;
    case 'search':
      actionData = await search_User_Action(data)
      break;

    default:
      actionData = {}
      break;
  }

  return json(actionData);
};

export const loader = async () => {
  let users = await fetchUser();
  userList = users;
  return { users: userList };
};

const Users = () => {
  const actionData = useActionData();
  const { users } = useLoaderData();
  const transition = useTransition();
  const searchUser = actionData?.users;
  const submit = useSubmit()
  const errors = actionData?.errors ? actionData.errors : null;
  const isSearching =
    transition.state === "submitting" &&
    transition.submission.formData.get("_action") === "search";
  let formRef = useRef();

  useEffect(() => {
    if (!isSearching) formRef.current.reset();
    if (searchUser?.length > 0 || errors) {
      setTimeout(() => {
        submit({ '_action': "reset" }, { method: "post" })
      }, 3000)
    }
  }, [isSearching, submit, searchUser?.length, errors]);
  return (
    <>
      <div className="page-header">
        <h1>Remix User Data Base</h1>
      </div>

      <Form ref={formRef} method="post" className="form">
        <div className="form-group">
          <RemixInput
            id="firstName"
            name="firstName"
            type="text"
            errors={errors?.firstName}
          />
          <RemixInput
            id="maidenName"
            name="maidenName"
            type="text"
            errors={errors?.maidenName}
          />
          <RemixInput
            id="lastName"
            name="lastName"
            type="text"
            errors={errors?.lastName}
          />
          <RemixInput
            id="username"
            name="username"
            type="text"
            errors={errors?.username}
          />
          <RemixInput id="age" name="age" type="number" errors={errors?.age} />
          <RemixInput id="gender" name="gender" type="dropdown" errors={errors?.gender} value={['select', 'male', 'female']} />


          {/* <RemixInput id="gender" name="gender" type="text" errors={errors?.gender} /> */}
          <RemixInput
            id="email"
            name="email"
            type="email"
            errors={errors?.email}
          />
          <RemixInput
            id="phone"
            name="phone"
            type="text"
            errors={errors?.phone}
          />
          <RemixInput
            id="birthDate"
            name="birthDate"
            type="text"
            errors={errors?.birthDate}
          />
        </div>
        <div className="btns">
          <div>
            {errors?.default ? (
              <em className="text-red-600">{errors.default}</em>
            ) : null}
          </div>
          <div>
            <button name="_action" className="btn btn-secondary" value="search">
              {transition.state === "submitting" &&
                transition.submission.formData.get("_action") === "search"
                ? "Searching"
                : "Search"}
            </button>
            <button name="_action" className="btn btn-sucess" value="add">
              {transition.state === "submitting" &&
                transition.submission.formData.get("_action") === "add"
                ? "Adding"
                : "Add"}
            </button>
            <div />
          </div>
        </div>
      </Form>
      {actionData?.success ? (
        <h4 className="text-center text-success">{actionData.success}</h4>
      ) : null}
      <div>
        <div className="grid-section">
          <UList className="grid-header user">
            <List className="id">Sr.No</List>
            <List className="name">Name</List>
            <List className="username">Username</List>
            <List className="age">Age</List>
            <List className="gender">Gender</List>
            <List className="contact">Contact</List>
            <List className="birth">Birth Date</List>
          </UList>
          {transition.state === "loading" ? (
            <h1>Loading...</h1>
          ) : (
            <UserList
              className="user-lists"
              users={users}
              searchUser={searchUser}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default Users;
