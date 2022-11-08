import {
  Form,
  useActionData,
  useTransition,
  useLoaderData,
  useSubmit,
} from "@remix-run/react";
import { useEffect, useRef } from "react";
import { add_User_Action, search_User_Action, delete_User_Action } from "~/utils/mockFn";
import RemixInput from "~/component/common/RemixInput";
import List from "~/component/common/List";
import UList from "~/component/common/UList";
import UserList from "~/component/UserList";
import { dummyUser, sendRequest } from '~/utils/config'

export const action = async ({ request }) => {
  const form = await request.formData();
  const { _action, ...data } = Object.fromEntries(form);
  let actionData = { users: false, success: false, errors: false };

  switch (_action) {
    case 'add':
      actionData = await add_User_Action(data, actionData)
      break;
    case 'search':
      actionData = await search_User_Action(data, actionData)
      break;
    case 'delete':
      actionData = await delete_User_Action(data._uuid, actionData)
      break;
    default:
      break;
  }
  return (actionData);
};

export const loader = async () => {
  const users = await sendRequest('users', 'get');
  return { users: users?.items };
};

const UserItem = () => {
  // Hooks State
  const actionData = useActionData();
  const { users } = useLoaderData();
  const transition = useTransition();
  const submit = useSubmit()
  // variables
  const searchUser = actionData?.users;
  const errors = actionData?.errors ? actionData.errors : null;
  const success = actionData?.success?.default ? actionData.success.default : null;

  // pending UI
  const isSearching =
    transition.state === "submitting" &&
    transition.submission.formData.get("_action") === "search";
  const isAdding =
    transition.state === "submitting" &&
    transition.submission.formData.get("_action") === "add";

  const dUsers = isAdding ? dummyUser(transition.submission?.formData) : null;
  let formRef = useRef();

  //Reset the state
  useEffect(() => {
    if (!isSearching && !isAdding) formRef.current.reset();
    if (searchUser > 0 || errors || success) {
      setTimeout(() => {
        submit({ '_action': "reset" }, { method: "post" })
      }, 5000)
    }
  }, [isSearching, submit, searchUser, errors, success, isAdding]);

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
          <RemixInput id="gender" name="gender" type="dropdown" errors={errors?.gender} value={['', 'male', 'female']} />
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
      {success ? (
        <em className="text-success">{success}</em>
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
            <List className="post">No. of Post</List>
          </UList>
          {transition.state === "loading" && searchUser ? (
            <h1>Loading...</h1>
          ) : (
            <>
              {isAdding && dUsers?.length > 0 ? <UserList
                className="user-lists"
                users={dUsers}
              /> : null}

              <UserList
                className="user-lists"
                users={users}
                searchUser={searchUser}
              />

            </>

          )}

        </div>
      </div>
    </>
  );
};





export default UserItem;
