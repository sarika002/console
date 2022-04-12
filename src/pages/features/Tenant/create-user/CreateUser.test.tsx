import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import "@testing-library/jest-dom/extend-expect";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import store from "../../../../store/index";
import CreateUser from "./CreateUser";

it("render without crashing CreateUser", async () => {
  await render(
    <BrowserRouter>
      <Provider store={store}>
        <CreateUser />
      </Provider>
    </BrowserRouter>
  );
});

it("test if input box is present", async () => {
  render(
    <BrowserRouter>
      <Provider store={store}>
        <CreateUser />
      </Provider>
    </BrowserRouter>
  );
  const usernameBox = await screen.getByTestId("username-input");
  expect(usernameBox).toBeInTheDocument();
  expect(usernameBox).toHaveAttribute("type", "text");

  const emailBox = screen.getByTestId("email-input");
  expect(emailBox).toBeInTheDocument();
  expect(emailBox).toHaveAttribute("type", "email");

  const passwordBox = screen.getByTestId("password-input");
  expect(passwordBox).toBeInTheDocument();
  expect(passwordBox).toHaveAttribute("type", "text");
});

it("test if input box takes input", async () => {
  render(
    <BrowserRouter>
      <Provider store={store}>
        <CreateUser />
      </Provider>
    </BrowserRouter>
  );
  const usernameBox = await screen.getByTestId("username-input");
  fireEvent.change(usernameBox, { target: { value: "akhilpinni" } });
  expect(screen.getByTestId("username-input")).toHaveValue("akhilpinni");

  const emailBox = screen.getByTestId("email-input");
  fireEvent.change(emailBox, {
    target: { value: "mailto:akhilpinni123@gmail.com" },
  });
  expect(screen.getByTestId("email-input")).toHaveValue(
    "mailto:akhilpinni123@gmail.com"
  );

  const passwordBox = screen.getByTestId("password-input");
  fireEvent.change(passwordBox, { target: { value: "akhilpinni123@" } });
  expect(screen.getByTestId("password-input")).toHaveValue("akhilpinni123@");
});

it("if submit and cancel buttons renders", async () => {
  render(
    <BrowserRouter>
      <Provider store={store}>
        <CreateUser />
      </Provider>
    </BrowserRouter>
  );
  const submitBtn = await screen.getByTestId("submit-button");
  expect(submitBtn).toBeInTheDocument();
  fireEvent.click(submitBtn);

  const cancelBtn = screen.getByTestId("cancel-button");
  expect(cancelBtn).toBeInTheDocument();
  fireEvent.click(cancelBtn);
});

it("multi select dropdown renders properlly", async () => {
  render(
    <BrowserRouter>
      <Provider store={store}>
        <CreateUser />
      </Provider>
    </BrowserRouter>
  );
  const submitBtn = screen.getByTestId("onsubmit");
  expect(submitBtn).toBeInTheDocument();
  fireEvent.submit(submitBtn);
});
