import {
  Form,
  useActionData,
  useTransition,
  useLoaderData,
} from "@remix-run/react";
import { json } from "@remix-run/node";
import { useEffect, useRef, useState } from "react";
import { addUser, search, fetchUser } from "~/utils/user.server";
import RemixInput from "~/component/common/RemixInput";
import List from "~/component/common/List";
import UList from "~/component/common/UList";
import UserList from "~/component/UserList";

let userList;

export const action = async ({ request }) => {
  const form = await request.formData();
  const { _action, ...data } = Object.fromEntries(form);
  const actionData = {};

  const {
    firstName = null,
    lastName = null,
    username = null,
    maidenName = "",
    email = null,
    age = null,
    phone = null,
    birthDate = null,
  } = data;
  if (_action === "add") {
    const errors = {
      firstName: firstName ? null : "First Name is required",
      lastName: lastName ? null : "Last Name is required",
      username: username ? null : "username is required",
      age: age ? null : "age is required",
      phone: phone ? null : "phone is required",
      email: email ? null : "email is required",
      birthDate: birthDate ? null : "birthDate is required",
    };
    const hasErrors = Object.values(errors).some(
      (errorMessage) => errorMessage
    );
    if (hasErrors) {
      actionData["errors"] = errors;
    } else {
      const user = {
        firstName,
        maidenName,
        lastName,
        email,
        phone,
        birthDate,
        age,
      };
      const res = addUser(user);
      actionData["success"] = res;
    }
  } else {
    let key, value;
    const keys = Object.keys(data);
    const values = Object.values(data);

    for (let i = 0; i < values.length; i++) {
      if (values[i]) {
        key = keys[i];
        value = values[i];
        break;
      }
    }
    if (key && value) {
      const searchUser = await search({ key, value });
      userList = searchUser;
      actionData["users"] = searchUser;
    } else {
      const errors = { default: "Please provide an input" };
      actionData["errors"] = errors;
    }
  }

  return json(actionData);
};

export const loader = async ({ request }) => {
  let users = await fetchUser();
  userList = users;
  return { users: userList };
};

const Users = () => {
  const actionData = useActionData();
  const { users } = useLoaderData();
  const transition = useTransition();
  console.log(transition);
  const errors = actionData?.errors ? actionData.errors : null;
  if (actionData?.users)
    setTimeout(() => {
      actionData["users"] = undefined;
    }, 5000);
  const isSearching =
    transition.state === "submitting" &&
    transition.submission.formData.get("_action") === "search";
  let formRef = useRef();
  useEffect(() => {
    if (!isSearching) formRef.current.reset();
  }, [isSearching]);

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
          <RemixInput id="age" name="age" type="text" errors={errors?.age} />
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
              searchUser={actionData?.users}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default Users;
